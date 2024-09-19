const express = require('express')
const router = express.Router()

const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication')

const {
  findAllPublishers,
  findSinglePublisher,
  createPublisher,
  updatePublisher,
  deletePublisher,
} = require('../controllers/publisher.controller')

router
  .route('/')
  .post(authenticateUser, authorizePermissions('admin'), createPublisher)
  .get(findAllPublishers)

router
  .route('/:id')
  .get(findSinglePublisher)
  .patch(authenticateUser, authorizePermissions('admin'), updatePublisher)
  .delete(authenticateUser, authorizePermissions('admin'), deletePublisher)

module.exports = router
