const Order = require('../models/order.model')
const Book = require('../models/book.model')
const crypto = require('crypto')

const { StatusCodes } = require('http-status-codes')
const CustomAPIError = require('../errors/')

const { checkPermissions } = require('../utils')

const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = 'someRandomValue'
  return { client_secret, amount }
}

const createOrder = async (req, res) => {
  const orderId = crypto.randomBytes(10).toString('hex')

  const {
    book_list,
    tax,
    shipping_fee,
    cart_total,
    customer_name,
    customer_email,
    customer_phone,
    shipping_address,
    recipient_name,
    recipient_phone,
    payment_method,
  } = req.body
  if (
    !customer_name ||
    !customer_email ||
    !customer_phone ||
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
      id: orderId,
      customer_name,
      customer_email,
      customer_phone,
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

const getAllOrders = async (req, res) => {
  const orders = await Order.findAll()
  res.status(StatusCodes.OK).json({ orders, count: orders.length })
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
  updateOrder,
}
