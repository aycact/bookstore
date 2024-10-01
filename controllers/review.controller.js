const { Review, Book } = require('../models')
const CustomAPIError = require('../errors/')
const checkPermissions = require('../utils/checkPermissions')
const { StatusCodes } = require('http-status-codes')

const createReview = async (req, res) => {
  const { book_id } = req.body

  const isValidBook = await Book.findByPk(book_id)

  if (!isValidBook) {
    throw new CustomAPIError.NotFoundError(
      `Không có sách nào có id: ${book_id}`
    )
  }

  const alreadySubmitted = await Review.findOne({
    where: {
      book_id,
      user_id: req.user.userId,
    },
  })

  if (alreadySubmitted) {
    throw new CustomAPIError.BadRequestError('Bạn đã đánh giá sách này rồi!')
  }

  req.body.user_id = req.user.userId
  
  const review = await Review.create({...req.body})
  res.status(StatusCodes.CREATED).json({ review })
}

const getAllReviews = async (req, res) => {
  const reviews = await Review.findAll({
    include: [
      {
        model: Book,
        attributes: ['title', 'price'],
      },
    ],
  })

  res.status(StatusCodes.OK).json({ reviews, count: reviews.length })
}

const getSingleReview = async (req, res) => {
  const { id } = req.params

  const review = await Review.findByPk(id)

  if (!review) {
    throw new CustomAPIError.NotFoundError(
      `Không tim được đánh giá có id: ${id}`
    )
  }

  res.status(StatusCodes.OK).json({ review })
}

const updateReview = async (req, res) => {
  const { id } = req.params
  const { rating, title, comment } = req.body

  const review = await Review.findByPk(id)

  if (!review) {
    throw new CustomAPIError.NotFoundError(
      `Không tìm thấy đánh giá có id: ${id}`
    )
  }

  checkPermissions(req.user, review.user_id)

  review.rating = rating
  review.title = title
  review.comment = comment

  await review.save()
  res.status(StatusCodes.OK).json({ review })
}

const deleteReview = async (req, res) => {
  const { id } = req.params

  const review = await Review.findByPk(id)

  if (!review) {
    throw new CustomAPIError.NotFoundError(`Không có đánh giá nào có id ${id}`)
  }

  checkPermissions(req.user, review.user_id)
  await review.destroy()
  res.status(StatusCodes.OK).json({ msg: 'Xóa đánh giá thành công' })
}

const getSingleBookReviews = async (req, res) => {
  const { id } = req.params
  const reviews = await Review.findOne({ book_id: id })
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length })
}

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleBookReviews,
}
