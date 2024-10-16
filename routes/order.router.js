const express = require('express')
const router = express.Router()
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication')

const {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
  createPaypalOrder,
  capturePaypalOrder,
  requestCancelOrder,
  createPayOSBankingOrder,
  confirmPayOSOrderCheckout,
  repayExistingOrderPayOS,
} = require('../controllers/order.controller')

router
  .route('/')
  .post(authenticateUser, createOrder)
  .get(authenticateUser, authorizePermissions('admin'), getAllOrders)

router
  .route('/requestCancelOrder/:id')
  .patch(authenticateUser, requestCancelOrder)
router.route('/showAllMyOrders').get(authenticateUser, getCurrentUserOrders)

router.route('/paypal/createOrder').post(authenticateUser, createPaypalOrder)
router
  .route('/paypal/:orderID/captureOrder')
  .post(authenticateUser, capturePaypalOrder)

router.route('/createPayOSLink').post(authenticateUser, createPayOSBankingOrder)
router
  .route('/repayExistingOrderPayOS')
  .post(authenticateUser, repayExistingOrderPayOS)
router.route('/confirmPayOSOrderCheckout').post(confirmPayOSOrderCheckout)

router
  .route('/:id')
  .get(authenticateUser, getSingleOrder)
  .patch(authenticateUser, updateOrder)

module.exports = router
