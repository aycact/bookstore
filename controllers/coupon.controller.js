const { Coupon, Publisher } = require('../models')
const CustomAPIError = require('../errors/')
const asyncWrapper = require('../middleware/async')
const { StatusCodes } = require('http-status-codes')
const { Op } = require('sequelize')

const findAllCoupons = asyncWrapper(async (req, res) => {
  const { search, status, applicable_publisher, sort } = req.query
  const where = {}

  if (search)
    where.code = {
      [Op.iLike]: `%${search}%`,
    }
  if (applicable_publisher) where.applicable_publisher = applicable_publisher
  if (status) where.status = status

  let order = [['start_date', 'DESC']]
  if (sort === 'mới nhất') order = [['start_date', 'DESC']]
  if (sort === 'cũ nhất') order = [['start_date', 'ASC']]
  if (sort === 'a-z') order = [['code', 'ASC']]
  if (sort === 'z-a') order = [['code', 'DESC']]

  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 12
  const offset = (page - 1) * limit
  const rows = await Coupon.findAll({
    where,
    limit,
    offset,
    order,
    include: {
      model: Publisher,
      attributes: ['name'],
    }
  })
  const coupons = await rows

  const { count: totalCoupons } = await Coupon.findAndCountAll({ where })
  const numOfPages = Math.ceil(totalCoupons / limit)
  res
    .status(StatusCodes.OK)
    .json({ coupons, meta: { page, numOfPages, totalCoupons } })
})

const findSingleCoupon = asyncWrapper(async (req, res) => {
  const { id: couponId } = req.params
  const coupon = await Coupon.findByPk(couponId)
  if (!coupon)
    throw new CustomAPIError.NotFoundError(`Coupon ${couponId} not found`)
  res.status(200).json({ coupon })
})

const createCoupon = asyncWrapper(async (req, res) => {
  const coupon = await Coupon.create({ ...req.body })
  res.status(201).json({ coupon })
})

const updateCoupon = asyncWrapper(async (req, res) => {
  const { id: couponId } = req.params
  const coupon = await Coupon.findByPk(couponId)
  await coupon.update({ ...req.body })
  res.status(200).json({ msg: 'update coupon successfully' })
})

const deleteCoupon = asyncWrapper(async (req, res) => {
  const { id: couponId } = req.params
  const coupon = await Coupon.findByPk(couponId)
  await coupon.destroy()
  res.status(200).json({ msg: 'delete coupon successfully' })
})

module.exports = {
  findAllCoupons,
  findSingleCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
}
