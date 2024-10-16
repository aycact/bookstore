const { UsedCoupon, Coupon } = require('../models')
const CustomAPIError = require('../errors/')
const asyncWrapper = require('../middleware/async')

const findAllUsedCoupons = asyncWrapper(async (req, res) => {
  const usedCoupon = await UsedCoupon.findAll()
  res.status(200).json({ usedCoupon })
})

const findSingleUsedCoupon = asyncWrapper(async (req, res) => {
  const { id } = req.params
  const usedCoupon = await UsedCoupon.findByPk(id)
  if (!usedCoupon)
    throw new CustomAPIError.NotFoundError(`Used coupon ${id} not found`)
  res.status(200).json({ usedCoupon })
})

const createUsedCoupon = asyncWrapper(async (req, res) => {
  const { coupon_id, user_id } = req.body
  const existingUsedCoupon = await UsedCoupon.findOne({
    where: { coupon_id, user_id },
    include,
  })
  if (!existingUsedCoupon) {
    const usedCoupon = await UsedCoupon.create({ ...req.body })
    return res.status(201).json({ usedCoupon })
  }
  return
})

const findAllCurrentUserCoupons = asyncWrapper(async (req, res) => {
  const user_id = req.user.userId
  const usedCoupon = await UsedCoupon.findAll({
    where: { user_id },
    include: [
      {
        model: Coupon,
        attributes: [
          'code',
          'description',
          'discount_type',
          'discount_amount',
          'discount_percentage',
          'min_order_value',
          'start_date',
          'expiration_date',
          'applicable_publisher',
        ],
      },
    ],
  })
  if(usedCoupon.length === 0) {
    throw new CustomAPIError.NotFoundError('Current user has no coupon to display') 
  }
  res.status(200).json({ usedCoupon })
})

const deleteUsedCoupon = asyncWrapper(async (req, res) => {
  const { id } = req.params
  const usedCoupon = await UsedCoupon.findByPk(id)
  await usedCoupon.destroy()
  res.status(200).json({ msg: 'delete used coupon successfully' })
})

module.exports = {
  createUsedCoupon,
  deleteUsedCoupon,
  findAllUsedCoupons,
  findSingleUsedCoupon,
  findAllCurrentUserCoupons,
}
