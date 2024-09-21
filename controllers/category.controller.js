const {Category} = require('../models')
const CustomAPIError = require('../errors/')
const asyncWrapper = require('../middleware/async')
const crypto = require('crypto')

const findAllCategories = asyncWrapper(async (req, res) => {
  const categories = await Category.findAll()
  res.status(200).json({ categories })
})

const findSingleCategory = asyncWrapper(async (req, res) => {
  const { id: categoryId } = req.params
  const category = await Category.findByPk(categoryId)
  if (!category) throw new CustomAPIError.NotFoundError(`Category ${categoryId} not found`)
  res.status(200).json({ category })
})

const createCategory = asyncWrapper(async (req, res) => {
  const category = await Category.create({ ...req.body })
  res.status(201).json({ category })
})

const updateCategory = asyncWrapper(async (req, res) => {
  const { id: categoryId } = req.params
  const category = await Category.findByPk(categoryId)
  await category.update({...req.body})
  res.status(200).json({ msg: "update category successfully" })
})

const deleteCategory = asyncWrapper(async (req, res) => {
  const { id: categoryId } = req.params
  const category = await Category.findByPk(categoryId)
  await category.destroy()
  res.status(200).json({ msg: "delete category successfully" })
})

module.exports = {
  findAllCategories,
  findSingleCategory,
  createCategory,
  updateCategory,
  deleteCategory,
}
