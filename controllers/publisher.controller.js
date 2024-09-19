const {Publisher} = require('../models')
const CustomAPIError = require('../errors/')
const asyncWrapper = require('../middleware/async')
const crypto = require('crypto')

const findAllPublishers = asyncWrapper(async (req, res) => {
  const publishers = await Publisher.findAll()
  res.status(200).json({ publishers })
})

const findSinglePublisher = asyncWrapper(async (req, res) => {
  const { id: publisherId } = req.params
  const publisher = await Publisher.findByPk(publisherId)
  if (!publisher)
    throw new CustomAPIError.NotFoundError(`Publisher ${publisherId} not found`)
  res.status(200).json({ publisher })
})

const createPublisher = asyncWrapper(async (req, res) => {
  const pubId = crypto.randomBytes(10).toString('hex')
  const publisher = await Publisher.create({ ...req.body, id: pubId })
  res.status(201).json({ publisher })
})

const updatePublisher = asyncWrapper(async (req, res) => {
  const { id: publisherId } = req.params
  const publisher = await Publisher.findByPk(publisherId)
  await publisher.update({ ...req.body })
  res.status(200).json({ msg: 'update publisher successfully' })
})

const deletePublisher = asyncWrapper(async (req, res) => {
  const { id: publisherId } = req.params
  const publisher = await Publisher.findByPk(publisherId)
  await publisher.destroy()
  res.status(200).json({ msg: 'delete publisher successfully' })
})

module.exports = {
  findAllPublishers,
  findSinglePublisher,
  createPublisher,
  updatePublisher,
  deletePublisher,
}
