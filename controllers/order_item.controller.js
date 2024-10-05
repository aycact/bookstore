const { OrderItem } = require('../models')
const CustomAPIError = require('../errors/')
const asyncWrapper = require('../middleware/async')

const findAllOrderItems = asyncWrapper(async (req, res) => {
  const orderItems = await OrderItem.findAll()
  res.status(200).json({ orderItems })
})

const findSingleOrderItem = asyncWrapper(async (req, res) => {
  const { id } = req.params
  const orderItem = await OrderItem.findByPk(id)
  if (!orderItem)
    throw new CustomAPIError.NotFoundError(`OrderItem ${id} not found`)
  res.status(200).json({ orderItem })
})

const createOrderItem = asyncWrapper(async (req, res) => {
  const { book_id, user_id } = req.body
  const existingOrderItem = await OrderItem.findOne({
    where: { book_id, user_id },
  })
  if(!existingOrderItem) {
      const orderItem = await OrderItem.create({ ...req.body })
      return res.status(201).json({ orderItem })
  }
  return
})

const deleteOrderItem = asyncWrapper(async (req, res) => {
  const { id } = req.params
  const orderItem = await OrderItem.findByPk(id)
  await orderItem.destroy()
  res.status(200).json({ msg: 'delete orderItem successfully' })
})

module.exports = {
  findAllOrderItems,
  findSingleOrderItem,
  createOrderItem,
  deleteOrderItem,
}
