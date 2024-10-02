const express = require('express')
const router = express.Router()
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication')

const {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleBookReviews,
  getCurrentUserReviewSingleBook,
} = require('../controllers/review.controller')

router
  .route('/')
  .post(authenticateUser, authorizePermissions('user'), createReview)
  .get(getAllReviews)

router.route('/books/:id').get(getSingleBookReviews)
router
  .route('/getCurrentUserReviewSingleBook/:id')
  .get(authenticateUser, getCurrentUserReviewSingleBook)

router
  .route('/:id')
  .get(getSingleReview)
  .patch(authenticateUser, updateReview)
  .delete(authenticateUser, deleteReview)

module.exports = router
