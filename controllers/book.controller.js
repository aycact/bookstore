const { StatusCodes } = require('http-status-codes')
const { Op } = require('sequelize')
const { Book, Category, Author, Publisher } = require('../models')
const Book_Info = require('../models/book_info.model')
const CustomAPIError = require('../errors/')
const asyncWrapper = require('../middleware/async')
const path = require('path')
const cloudinary = require('cloudinary').v2
const fs = require('fs')

const findNewBooks = async (req, res) => {
  const newBooks = await Book_Info.findAll({
    order: [['publication_date', 'DESC']],
    limit: 8,
  })
  res.status(StatusCodes.OK).json({ newBooks })
}

const findAllBooks = asyncWrapper(async (req, res) => {
  const { search, category, publisher, author, sort } = req.query
  const where = {}
  if (search) {
    where[Op.or] = [
      {
        title: {
          [Op.iLike]: `%${search}%`,
        },
      },
      {
        author: {
          [Op.iLike]: `%${search}%`,
        },
      },
    ]
  }
  if (category) where.category_id = category
  if (author) where.author_id = author
  if (publisher) where.publisher_id = publisher

  let order = [['publication_date', 'DESC']]
  if (sort === 'latest') order = [['publication_date', 'DESC']]
  if (sort === 'oldest') order = [['publication_date', 'ASC']]
  if (sort === 'a-z') order = [['title', 'ASC']]
  if (sort === 'z-a') order = [['title', 'DESC']]

  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 12
  const offset = (page - 1) * limit
  const rows = await Book_Info.findAll({
    where,
    limit,
    offset,
    order,
  })
  const books = await rows

  const { count: totalBooks } = await Book_Info.findAndCountAll({ where })
  const numOfPages = Math.ceil(totalBooks / limit)
  res
    .status(StatusCodes.OK)
    .json({ books, meta: { page, numOfPages, totalBooks } })
})

const findSingleBook = asyncWrapper(async (req, res) => {
  const { id: bookId } = req.params
  const book = await Book.findByPk(bookId, {
    include: [
      {
        model: Author,
        attributes: ['name'],
      },
      {
        model: Publisher,
        attributes: ['name'],
      },
      {
        model: Category,
        attributes: ['name'],
      },
    ],
  })
  if (!book) throw new CustomAPIError.NotFoundError(`Book ${bookId} not found`)
  res.status(StatusCodes.OK).json({ book })
})

const createBook = asyncWrapper(async (req, res) => {  
  // const now = new Date()
  // const day = String(now.getDate()).padStart(2, '0')
  // const month = String(now.getMonth() + 1).padStart(2, '0')
  // const year = now.getFullYear()
  // const formattedDate = `${month}/${day}/${year}`

  let img = null
  if(req.files?.book_img) {
    const result = await cloudinary.uploader.upload(
      req.files?.book_img?.tempFilePath, // file dc lưu tạm thời trong đường dẫn này
      { use_filename: true, folder: 'file-upload' } // up lên file upload trên cloudinary
    )
    fs.unlinkSync(req.files.book_img.tempFilePath) 
    img = result?.secure_url
  }

  const book = await Book.create({
    ...req.body,
    book_img: img,
  })
  res.status(StatusCodes.CREATED).json({ book })
})

const updateBook = asyncWrapper(async (req, res) => {
  const { id: bookId } = req.params
  const book = await Book.findByPk(bookId)
  await book.update({ ...req.body })
  res.status(StatusCodes.OK).json({ msg: 'update book successfully' })
})

const deleteBook = asyncWrapper(async (req, res) => {
  const { id: bookId } = req.params
  const book = await Book.findByPk(bookId)
  await book.destroy()
  res.status(StatusCodes.OK).json({ msg: 'delete book successfully' })
})

const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new CustomAPIError.BadRequestError('No File Uploaded')
  }
  const productImage = req.files.image

  if (!productImage.mimetype.startsWith('image')) {
    throw new CustomAPIError.BadRequestError('Please Upload Image')
  }

  const maxSize = 1024 * 1024

  if (productImage.size > maxSize) {
    throw new CustomAPIError.BadRequestError(
      'Please upload image smaller than 1MB'
    )
  }

  const imagePath = path.join(
    __dirname,
    '../public/uploads/book_img/' + `${productImage.name}`
  )
  await productImage.mv(imagePath)
  res
    .status(StatusCodes.OK)
    .json({ image: `/uploads/book_img/${productImage.name}` })
}

module.exports = {
  findAllBooks,
  findSingleBook,
  createBook,
  updateBook,
  deleteBook,
  uploadImage,
  findNewBooks,
}
