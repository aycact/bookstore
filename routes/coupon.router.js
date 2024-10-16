const express = require('express')
const router = express.Router()

const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication')

const {
  findAllCoupons,
  findSingleCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} = require('../controllers/coupon.controller')

router
  .route('/')
  .get(authenticateUser, authorizePermissions('admin'), findAllCoupons)
  .post(authenticateUser, authorizePermissions('admin'), createCoupon)
router
  .route('/:id')
  .get(authenticateUser, authorizePermissions('admin'), findSingleCoupon)
  .patch(authenticateUser, authorizePermissions('admin'), updateCoupon)
  .delete(authenticateUser, authorizePermissions('admin'), deleteCoupon)


module.exports = router
