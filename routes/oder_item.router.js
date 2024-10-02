const express = require('express')
const router = express.Router()

const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication')

const {
  findAllOrderItems,
  findSingleOrderItem,
  createOrderItem,
  deleteOrderItem,
} = require('../controllers/order_item.controller')

router
  .route('/')
  .post(authenticateUser, createOrderItem)
  .get(authenticateUser, authorizePermissions('admin'), findAllOrderItems)

router
  .route('/:id')
  .get(findSingleOrderItem)
  .delete(authenticateUser, authorizePermissions('admin'), deleteOrderItem)

module.exports = router
