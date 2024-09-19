const express = require('express')
const router = express.Router()

const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication')

const {
  findAllAuthors,
  findSingleAuthor,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  uploadImage
} = require('../controllers/author.controller')

router
  .route('/')
  .post(authenticateUser, authorizePermissions('admin'),createAuthor)
  .get(findAllAuthors)

router
  .route('/:id')
  .get(findSingleAuthor)
  .patch(authenticateUser, authorizePermissions('admin'),updateAuthor)
  .delete(authenticateUser, authorizePermissions('admin'),deleteAuthor)

router
  .route('/uploadImage')
  .post([authenticateUser, authorizePermissions('admin')], uploadImage)

module.exports = router
