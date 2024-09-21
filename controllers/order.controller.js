const Order = require('../models/order.model')
const Book = require('../models/book.model')
const crypto = require('crypto')
const { v4: uuidv4 } = require('uuid')
const fetch = require('node-fetch')

const { StatusCodes } = require('http-status-codes')
const CustomAPIError = require('../errors/')

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

const createPaypalOrder = async (cart) => {
  const orderId = uuidv4()
  const accessToken = await generateAccessTokenPaypal()
  const url = `${base}/v2/checkout/orders`

  const {
    book_list,
    tax,
    shipping_fee,
    cart_total,
    customer_email,
    shipping_address,
    recipient_name,
    recipient_phone,
    payment_method,
    user_id,
  } = cart

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

  if (!tax || !shipping_fee || !cart_total) {
    throw new CustomAPIError.BadRequestError(
      'Please provide tax and shipping fee and cart total'
    )
  }

  let orderItems = []
  let subtotal = 0
  for (const book of book_list) {
    const dbBook = await Book.findByPk(book.bookId)
    if (!dbBook) {
      throw new CustomAPIError.NotFoundError(`No book with id : ${book.bookId}`)
    }
    const { title, price, book_img, id } = dbBook
    const singleOrderItem = {
      amount: book.amount,
      title,
      price,
      book_img,
      bookID: id,
    }
    // add item to order
    orderItems = [...orderItems, singleOrderItem]
    // calculate subtotal
    subtotal += book.amount * price
  }
  // calculate total
  const total = tax + shipping_fee + subtotal
  if (total !== cart_total)
    throw new CustomAPIError.BadRequestError(
      'Have different in total price between client and server!'
    )

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
    tax,
    total,
    user_id,
  })

  const payload = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        reference_id: orderId,
        amount: {
          currency_code: 'USD',
          value: subtotal,
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

  return handleResponse(response)
}

const capturePaypalOrder = async (orderID, userId) => {
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

  // const invoice = await response.json
  // // Lưu order vào postgres
  // const order = await Order.create({
  //   id: invoice.id,
  //   customer_email: invoice.payer.email_address,
  //   shipping_address: `${invoice.purchase_units.shipping.address.address_line_1}, ${invoice.purchase_units.shipping.address.admin_area_2}, ${invoice.purchase_units.shipping.country_code}`,
  //   recipient_name: invoice.purchase_units.shipping.name.full_name,
  //   payment_method: 'E-Wallet',
  //   total: invoice.purchase_units.payments.captures.amount.value,
  //   user_id: userId,
  // })

  return handleResponse(response)
}

const createOrder = async (req, res) => {
  const {
    book_list,
    tax,
    shipping_fee,
    cart_total,
    customer_email,
    shipping_address,
    recipient_name,
    recipient_phone,
    payment_method,
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
  if (!tax || !shipping_fee || !cart_total) {
    throw new CustomAPIError.BadRequestError(
      'Please provide tax and shipping fee and cart total'
    )
  }

  let orderItems = []
  let subtotal = 0
  for (const book of book_list) {
    const dbBook = await Book.findByPk(book.bookId)
    if (!dbBook) {
      throw new CustomAPIError.NotFoundError(`No book with id : ${book.bookId}`)
    }
    const { title, price, book_img, id } = dbBook
    const singleOrderItem = {
      amount: book.amount,
      title,
      price,
      book_img,
      bookID: id,
    }
    // add item to order
    orderItems = [...orderItems, singleOrderItem]
    // calculate subtotal
    subtotal += book.amount * price
  }
  // calculate total
  const total = tax + shipping_fee + subtotal
  if (total !== cart_total)
    throw new CustomAPIError.BadRequestError(
      'Have different in total price between client and server!'
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
      tax,
      total,
      user_id: req.user.userId,
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
    tax,
    total,
    user_id: req.user.userId,
    client_secret: paymentIntent.client_secret,
  })

  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret })
}

// const createPaypalOrder = async (req, res) => {
//   const orderId = uuidv4()
//   const paypalRequestId = uuidv4()

//   const {
//     book_list,
//     tax,
//     shipping_fee,
//     cart_total,
//     customer_email,
//     shipping_address,
//     recipient_name,
//     recipient_phone,
//     payment_method,
//     client_id,
//   } = req.body

//   if (
//     !recipient_name ||
//     !customer_email ||
//     !recipient_phone ||
//     !shipping_address ||
//     !payment_method
//   ) {
//     throw new CustomAPIError.BadRequestError('Please provide customer details')
//   }

//   if (!book_list || book_list.length < 1) {
//     throw new CustomAPIError.BadRequestError('No cart items provided')
//   }

//   if (!tax || !shipping_fee || !cart_total) {
//     throw new CustomAPIError.BadRequestError(
//       'Please provide tax and shipping fee and cart total'
//     )
//   }

//   let orderItems = []
//   let subtotal = 0
//   for (const book of book_list) {
//     const dbBook = await Book.findByPk(book.bookId)
//     if (!dbBook) {
//       throw new CustomAPIError.NotFoundError(`No book with id : ${book.bookId}`)
//     }
//     const { title, price, book_img, id } = dbBook
//     const singleOrderItem = {
//       amount: book.amount,
//       title,
//       price,
//       book_img,
//       bookID: id,
//     }
//     // add item to order
//     orderItems = [...orderItems, singleOrderItem]
//     // calculate subtotal
//     subtotal += book.amount * price
//   }
//   // calculate total
//   const total = tax + shipping_fee + subtotal
//   if (total !== cart_total)
//     throw new CustomAPIError.BadRequestError(
//       'Have different in total price between client and server!'
//     )
//   // get client secret

//   const order = await Order.create({
//     id: orderId,
//     customer_email,
//     shipping_address,
//     recipient_name,
//     recipient_phone,
//     payment_method,
//     book_list: orderItems,
//     subtotal, // trị giá đơn hàng có tính phí ship và thuế
//     shipping_fee,
//     tax,
//     total,
//     user_id: req.user.userId,
//   })

//   const { id: paypalOrderId } = await fetch(
//     'https://api-m.sandbox.paypal.com/v2/checkout/orders',
//     {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'PayPal-Request-Id': paypalRequestId,
//         Authorization: `Basic ${client_id}`,
//       },
//       body: JSON.stringify({
//         intent: 'CAPTURE',
//         purchase_units: [
//           {
//             reference_id: orderId,
//             amount: { currency_code: 'USD', value: total },
//             item: orderItems,
//           },
//         ],
//       }),
//     }
//   )

//   return res.status(StatusCodes.CREATED).json({ order, paypalOrderId })

//   // const order = await Order.create({
//   //   customer_name,
//   //   customer_email,
//   //   customer_phone,
//   //   shipping_address,
//   //   recipient_name,
//   //   recipient_phone,
//   //   payment_method,
//   //   book_list: JSON.stringify(orderItems),
//   //   subtotal, // trị giá đơn hàng có tính phí ship và thuế
//   //   shipping_fee,
//   //   tax,
//   //   total,
//   //   user_id: req.user.userId,
//   //   client_secret: paymentIntent.client_secret,
//   // })
// }

const getAllOrders = async (req, res) => {
  const order = [['created_at', 'DESC']]

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
const updateOrder = async (req, res) => {
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

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  createPaypalOrder,
  updateOrder,
  capturePaypalOrder,
}
