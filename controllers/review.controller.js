const { Review, Book, OrderItem, User } = require('../models')
const CustomAPIError = require('../errors/')
const checkPermissions = require('../utils/checkPermissions')
const { StatusCodes } = require('http-status-codes')
const sequelize = require('../dbconfig')

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

  const alreadyOrderedByUser = await OrderItem.findOne({
    where: {
      book_id,
      user_id: req.user.userId,
    },
  })

  if (!alreadyOrderedByUser) {
    throw new CustomAPIError.BadRequestError('Bạn cần mua sản phẩm để đánh giá!')
  }

  req.body.user_id = req.user.userId

  const review = await Review.create({ ...req.body })
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

const getCurrentUserReviewSingleBook = async (req, res) => {
  const { id } = req.params
  const key = process.env.ENCRYPTED_KEY
  const review = await Review.findOne({
    where: { book_id: id, user_id: req.user.userId },
    include: {
      model: User,
      attributes: [
        [sequelize.literal(`pgp_sym_decrypt("name", '${key}')`), 'name'],
        'user_img',
      ],
    },
  })

  if (review) {
    return res.status(StatusCodes.OK).json({ review }) // trường hợp người dùng đã đánh giá
  }
  return res.status(StatusCodes.OK).json({ review: false }) // trường hợp người dùng chưa đánh giá
}

const getSingleBookReviews = async (req, res) => {
  const { id } = req.params
  const key = process.env.ENCRYPTED_KEY
  const reviews = await Review.findAll({
    where: { book_id: id },
    order: [['created_at', 'DESC']],
    include: {
      model: User,
      attributes: [
        [sequelize.literal(`pgp_sym_decrypt("name", '${key}')`), 'name'],
        'user_img',
      ],
    },
  })
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length })
}

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleBookReviews,
  getCurrentUserReviewSingleBook,
}
