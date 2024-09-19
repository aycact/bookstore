const express = require('express')
const router = express.Router()

const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication')

const {
  findAllBooks,
  findSingleBook,
  createBook,
  updateBook,
  deleteBook,
  findNewBooks,
} = require('../controllers/book.controller')

router
  .route('/')
  .post(authenticateUser, authorizePermissions('admin'), createBook)
  .get(findAllBooks)
router.route('/findNewBooks').get(findNewBooks)

router
  .route('/:id')
  .get(findSingleBook)
  .patch(authenticateUser, authorizePermissions('admin'), updateBook)
  .delete(authenticateUser, authorizePermissions('admin'), deleteBook)

// router
//   .route('/uploadImage')
//   .post([authenticateUser, authorizePermissions('admin')], uploadImage)

module.exports = router
