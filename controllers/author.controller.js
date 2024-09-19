const {Author} = require('../models')
const CustomAPIError = require('../errors/')
const asyncWrapper = require('../middleware/async')
const crypto = require('crypto')
const cloudinary = require('cloudinary').v2
const fs = require('fs')


const findAllAuthors = asyncWrapper(async (req, res) => {
  const authors = await Author.findAll()
  res.status(200).json({ authors })
})

const findSingleAuthor = asyncWrapper(async (req, res) => {
  const { id: authorId } = req.params
  const author = await Author.findByPk(authorId)
  if(!author) 
    throw new CustomAPIError.NotFoundError('Author not found!')
  res.status(200).json({ author })
})

const createAuthor = asyncWrapper(async (req, res) => {
  const authorId = crypto.randomBytes(10).toString('hex')
  let img = null
  if (req.files?.authorImg) {
    const result = await cloudinary.uploader.upload(
      req.files?.authorImg?.tempFilePath, // file dc lưu tạm thời trong đường dẫn này
      { use_filename: true, folder: 'file-upload' } // up lên file upload trên cloudinary
    )
    fs.unlinkSync(req.files.authorImg.tempFilePath)
    img = result?.secure_url
  }

  const author = await Author.create({
    id: authorId,
    ...req.body,
    authorImg: img,
  })
  res.status(201).json({ author })
})

const updateAuthor = asyncWrapper(async (req, res) => {
  const { id: authorId } = req.params
  const author = await Author.findByPk(authorId)
  await author.update({...req.body})
  res.status(200).json({ msg: "update author successfully" })
})

const deleteAuthor = asyncWrapper(async (req, res) => {
  const { id: authorId } = req.params
  const author = await Author.findByPk(authorId)
  await author.destroy()
  res.status(200).json({ msg: "delete author successfully" })
})

const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new CustomError.BadRequestError('No File Uploaded')
  }
  const productImage = req.files.image

  if (!productImage.mimetype.startsWith('image')) {
    throw new CustomError.BadRequestError('Please Upload Image')
  }

  const maxSize = 1024 * 1024

  if (productImage.size > maxSize) {
    throw new CustomError.BadRequestError(
      'Please upload image smaller than 1MB'
    )
  }

  const imagePath = path.join(
    __dirname,
    '../public/uploads/author_img/' + `${productImage.name}`
  )
  await productImage.mv(imagePath)
  res
    .status(StatusCodes.OK)
    .json({ image: `/uploads/author_img/${productImage.name}` })
}

module.exports = {
  findAllAuthors,
  findSingleAuthor,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  uploadImage,
}