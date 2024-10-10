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
} = require('../controllers/order.controller')

router
  .route('/')
  .post(authenticateUser, createOrder)
  .get(authenticateUser, authorizePermissions('admin'), getAllOrders)

router.route('/requestCancelOrder/:id').patch(authenticateUser, requestCancelOrder)
router.route('/showAllMyOrders').get(authenticateUser, getCurrentUserOrders)

router.route('/paypal/createOrder').post(authenticateUser, async (req, res) => {
  try {
    const cart = {...req.body, user_id: req.user.userId}
    const { jsonResponse, httpStatusCode } = await createPaypalOrder(cart)
    
    res.status(httpStatusCode).json(jsonResponse)
  } catch (error) {
    console.error('Failed to create order:', error)
    res.status(500).json({ error: 'Failed to create order.' })
  }
})
router
  .route('/paypal/:orderID/captureOrder')
  .post(authenticateUser, async (req, res) => {
    try {
      const { orderID } = req.params
      const { jsonResponse, httpStatusCode } = await capturePaypalOrder(orderID, req.user.UserId)
      res.status(httpStatusCode).json(jsonResponse)
    } catch (error) {
      console.error('Failed to create order:', error)
      res.status(500).json({ error: 'Failed to capture order.' })
    }
  })

router
  .route('/:id')
  .get(authenticateUser, getSingleOrder)
  .patch(authenticateUser, updateOrder)

  
module.exports = router
