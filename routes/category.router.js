const express = require('express')
const router = express.Router()

const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication')

const {
  findAllCategories,
  findSingleCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/category.controller')

router
  .route('/')
  .post(authenticateUser, authorizePermissions('admin'), createCategory)
  .get(findAllCategories)

router
  .route('/:id')
  .get(findSingleCategory)
  .patch(authenticateUser, authorizePermissions('admin'), updateCategory)
  .delete(authenticateUser, authorizePermissions('admin'), deleteCategory)

module.exports = router
