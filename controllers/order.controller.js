const { Book, Order, Author, Coupon } = require('../models')

const { v4: uuidv4 } = require('uuid')
const fetch = require('node-fetch')

const { StatusCodes } = require('http-status-codes')
const CustomAPIError = require('../errors/')
const {
  checkPriceValidity,
  convertVNDToUSD,
  payos,
  isValidData,
} = require('../utils')

const {
  checkPermissions,
  handleResponse,
  generateAccessTokenPaypal,
} = require('../utils')

const base = 'https://api-m.sandbox.paypal.com'

const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = 'someRandomValue'
  return { client_secret, amount }
}

const repayExistingOrderPayOS = async (req, res) => {
  const order = req.body
  if (order.is_paid)
    throw new CustomAPIError.BadRequestError('Đơn hàng này đã được thanh toán')

  const isExistingOrder = await Order.findOne({
    where: { payos_order_code: order.payos_order_code },
  })
  if (!isExistingOrder)
    throw new CustomAPIError.NotFoundError(
      'Không tìm thấy đơn hàng thanh toán qua payos'
    )

  const { total, coupon_code } = await checkPriceValidity({
    book_list: order.book_list,
    shipping_fee: order.shipping_fee,
    cart_total: order.cart_total,
    coupon: order.coupon,
    user_id: req.user.userId,
  })

  res
    .status(StatusCodes.CREATED)
    .json({ paymentLink: { paymentLinkId: order.payos_order_code } })
}

const createPayOSBankingOrder = async (req, res) => {
  try {
    const cart = { ...req.body, user_id: req.user.userId }
    const orderId = uuidv4()

    const {
      book_list,
      shipping_fee,
      cart_total,
      customer_email,
      shipping_address,
      recipient_name,
      recipient_phone,
      payment_method,
      user_id,
      coupon,
    } = cart

    if (
      !recipient_name ||
      !customer_email ||
      !recipient_phone ||
      !shipping_address ||
      !payment_method
    ) {
      throw new CustomAPIError.BadRequestError(
        'Please provide customer details'
      )
    }

    if (!book_list || book_list.length < 1) {
      throw new CustomAPIError.BadRequestError('No cart items provided')
    }

    if (!shipping_fee || !cart_total) {
      throw new CustomAPIError.BadRequestError(
        'Please provide tax and shipping fee and cart total'
      )
    }

    const { orderItems, subtotal, total, coupon_code } =
      await checkPriceValidity({
        book_list,
        shipping_fee,
        cart_total,
        coupon,
        user_id: req.user.userId,
      })
    const orderCode = Number(`${Date.now()}`)
    const order = {
      amount: Math.ceil(total) * 100,
      orderCode,
      description: `Thanh toán từ PayOS`,
      buyerName: recipient_name,
      buyerEmail: customer_email,
      buyerPhone: recipient_phone,
      buyerAddress: shipping_address,
      cancelUrl: `${process.env.ORIGIN}/order`,
      returnUrl: `${process.env.ORIGIN}/order`,
      reference: orderId,
    }

    const paymentLink = await payos.createPaymentLink(order)

    await Order.create({
      id: orderId,
      customer_email,
      shipping_address,
      recipient_name,
      recipient_phone,
      payment_method,
      book_list: orderItems,
      subtotal,
      shipping_fee,
      total,
      user_id,
      payos_order_code: `${paymentLink.paymentLinkId}`,
      coupon_code,
    })

    res.status(StatusCodes.CREATED).json({ paymentLink })
  } catch (error) {
    console.error('Failed to create order:', error)
    res.status(500).json({ error: 'Failed to create order.' })
  }
}

const confirmPayOSOrderCheckout = async (req, res) => {
  console.log(req.body)

  try {
    if (req.body.data.description === 'VQRIO123') return res.json()

    const checkValidCheckout = isValidData(
      req.body.data,
      req.body.signature,
      process.env.PAYOS_CHECKSUMKEY
    )

    if (!checkValidCheckout)
      throw new CustomAPIError.BadRequestError(
        'Thông tin thanh toán không nhất quán!'
      )

    const isExistingOrder = await Order.findOne({
      where: { payos_order_code: req.body.data.paymentLinkId },
    })
    if (!isExistingOrder)
      throw new CustomAPIError.NotFoundError(
        'Không tìm thấy đơn hàng thanh toán qua payos'
      )

    isExistingOrder.is_paid = true
    await isExistingOrder.save()

    res.status(StatusCodes.OK).json({ updatedOrder: isExistingOrder })
  } catch (error) {
    console.log(error)
  }
}

const createPaypalOrder = async (req, res) => {
  try {
    const cart = { ...req.body, user_id: req.user.userId }
    const orderId = uuidv4()
    const accessToken = await generateAccessTokenPaypal()
    const url = `${base}/v2/checkout/orders`

    const {
      book_list,
      shipping_fee,
      cart_total,
      customer_email,
      shipping_address,
      recipient_name,
      recipient_phone,
      payment_method,
      user_id,
      coupon,
    } = cart

    if (
      !recipient_name ||
      !customer_email ||
      !recipient_phone ||
      !shipping_address ||
      !payment_method
    ) {
      throw new CustomAPIError.BadRequestError(
        'Please provide customer details'
      )
    }

    if (!book_list || book_list.length < 1) {
      throw new CustomAPIError.BadRequestError('No cart items provided')
    }

    if (!shipping_fee || !cart_total) {
      throw new CustomAPIError.BadRequestError(
        'Please provide tax and shipping fee and cart total'
      )
    }

    const { orderItems, subtotal, total, coupon_code } =
      await checkPriceValidity({
        book_list,
        shipping_fee,
        cart_total,
        coupon,
        user_id: req.user.userId,
      })

    const payload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: orderId,
          amount: {
            currency_code: 'USD',
            value: convertVNDToUSD(total * 1000),
          },
        },
      ],
    }

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        // Uncomment one of these to force an error for negative testing (in sandbox mode only).
        // Documentation: https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
        // "PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
      },
      method: 'POST',
      body: JSON.stringify(payload),
    })

    await Order.create({
      id: orderId,
      customer_email,
      shipping_address,
      recipient_name,
      recipient_phone,
      payment_method,
      book_list: orderItems,
      subtotal,
      shipping_fee,
      total,
      user_id,
      coupon_code,
    })

    const { jsonResponse, httpStatusCode } = await handleResponse(response)
    res.status(httpStatusCode).json(jsonResponse)
  } catch (error) {
    console.error('Failed to create order:', error)
    res.status(500).json({ error: 'Failed to create order.' })
  }
}

const capturePaypalOrder = async (req, res) => {
  try {
    const { orderID } = req.params
    const userId = req.user.UserId
    const accessToken = await generateAccessTokenPaypal()
    const url = `${base}/v2/checkout/orders/${orderID}/capture`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        // Uncomment one of these to force an error for negative testing (in sandbox mode only).
        // Documentation:
        // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
        // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
      },
    })

    const invoice = await response.json()

    // // Cập nhật order vào postgres
    const order = await Order.findByPk(invoice?.purchase_units[0]?.reference_id)
    if (!order) {
      throw new CustomAPIError.NotFoundError(
        `No order with id : ${invoice?.purchase_units[0]?.reference_id}`
      )
    }
    order.is_paid = true
    order.payment_intent_id = invoice?.purchase_units[0]?.payments?.captures?.id
    await order.save()

    const jsonResponse = invoice
    const httpStatusCode = response.status

    res.status(httpStatusCode).json(jsonResponse)
  } catch (error) {
    console.error('Failed to create order:', error)
    res.status(500).json({ error: 'Failed to capture order.' })
  }
}

const createOrder = async (req, res) => {
  const {
    book_list,
    shipping_fee,
    cart_total,
    customer_email,
    shipping_address,
    recipient_name,
    recipient_phone,
    payment_method,
    coupon,
  } = req.body

  if (
    !recipient_name ||
    !customer_email ||
    !recipient_phone ||
    !shipping_address ||
    !payment_method
  ) {
    throw new CustomAPIError.BadRequestError('Please provide customer details')
  }

  if (!book_list || book_list.length < 1) {
    throw new CustomAPIError.BadRequestError('No cart items provided')
  }
  if (!shipping_fee || !cart_total) {
    throw new CustomAPIError.BadRequestError(
      'Please provide tax and shipping fee and cart total'
    )
  }
  const { orderItems, subtotal, total, coupon_code } = await checkPriceValidity(
    {
      book_list,
      shipping_fee,
      cart_total,
      coupon,
      user_id: req.user.userId,
    }
  )

  // get client secret
  if (payment_method === 'COD') {
    const order = await Order.create({
      customer_email,
      shipping_address,
      recipient_name,
      recipient_phone,
      payment_method,
      book_list: orderItems,
      subtotal, // trị giá đơn hàng có tính phí ship và thuế
      shipping_fee,
      total,
      user_id: req.user.userId,
      coupon_code,
    })

    res.status(StatusCodes.CREATED).json({ order })
    return
  }

  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: 'usd',
  })

  const order = await Order.create({
    customer_name,
    customer_email,
    customer_phone,
    shipping_address,
    recipient_name,
    recipient_phone,
    payment_method,
    book_list: JSON.stringify(orderItems),
    subtotal, // trị giá đơn hàng có tính phí ship và thuế
    shipping_fee,
    total,
    user_id: req.user.userId,
    client_secret: paymentIntent.client_secret,
  })

  await Order.create({
    id: orderId,
    customer_email,
    shipping_address,
    recipient_name,
    recipient_phone,
    payment_method,
    book_list: orderItems,
    subtotal,
    shipping_fee,
    total,
    user_id,
  })

  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret })
}

const getAllOrders = async (req, res) => {
  const order = [
    ['request_cancel', 'DESC'],
    ['created_at', 'DESC'],
  ]

  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 12
  const offset = (page - 1) * limit

  const rows = await Order.findAll({
    limit,
    offset,
    order,
  })

  const orders = await rows

  const { count: totalOrders } = await Order.findAndCountAll()
  const numOfPages = Math.ceil(totalOrders / limit)
  res
    .status(StatusCodes.OK)
    .json({ orders, meta: { page, numOfPages, totalOrders } })
}

const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params
  const order = await Order.findByPk(orderId)
  if (!order) {
    throw new CustomAPIError.NotFoundError(`No order with id : ${orderId}`)
  }
  checkPermissions(req.user, order.user_id)

  if (order.coupon_code) {
    const coupon = await Coupon.findOne({where: {code: order.coupon_code}})
    return res.status(StatusCodes.OK).json({ order, coupon })
  }
  res.status(StatusCodes.OK).json({ order })
}

const getCurrentUserOrders = async (req, res) => {
  const where = { user_id: req.user.userId }
  const order = [['created_at', 'DESC']]

  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 12
  const offset = (page - 1) * limit
  const rows = await Order.findAll({
    where,
    limit,
    offset,
    order,
  })
  const orders = await rows

  const { count: totalOrders } = await Order.findAndCountAll({ where })
  const numOfPages = Math.ceil(totalOrders / limit)
  res
    .status(StatusCodes.OK)
    .json({ orders, meta: { page, numOfPages, totalOrders } })
}
// đã thanh toán
const updatePaidOrder = async (req, res) => {
  const { id: orderId } = req.params
  const order = await Order.findByPk(orderId)
  if (!order) {
    throw new CustomAPIError.NotFoundError(`No order with id : ${orderId}`)
  }
  checkPermissions(req.user, order.user)

  if (order.payment_method === 'COD') {
    order.status = 'paid'
    await order.save()
    return res.status(StatusCodes.OK).json({ order })
  }

  const { paymentIntentId } = req.body
  order.payment_intent_id = paymentIntentId
  order.status = 'paid'
  await order.save()

  res.status(StatusCodes.OK).json({ order })
}

const requestCancelOrder = async (req, res) => {
  const { id: orderId } = req.params
  const order = await Order.findByPk(orderId)
  if (!order) {
    throw new CustomAPIError.NotFoundError(
      `Không thể tìm được đơn hàng ${orderId}`
    )
  }
  checkPermissions(req.user, order.user_id)
  if (order.status !== 'chờ xác nhận')
    throw new CustomAPIError.BadRequestError(
      `Đơn hàng đã được xác nhận. Vui lòng liên hệ nhân viên để xử lý!`
    )
  order.request_cancel = true
  order.save()
  res.status(StatusCodes.OK).json({ msg: 'Yêu cầu hủy đơn hàng đã được gửi!' })
}

const updateOrder = async (req, res) => {
  const { id: orderId } = req.params
  const order = await Order.findByPk(orderId)
  await order.update({ ...req.body })

  return res
    .status(StatusCodes.OK)
    .json({ msg: 'Cập nhật đơn hàng thành công' })
}

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  createPaypalOrder,
  updatePaidOrder,
  capturePaypalOrder,
  requestCancelOrder,
  updateOrder,
  createPayOSBankingOrder,
  confirmPayOSOrderCheckout,
  repayExistingOrderPayOS,
}
