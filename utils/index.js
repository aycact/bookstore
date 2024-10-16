require('dotenv').config()
const { Sequelize } = require('sequelize')
const { createJWT, isTokenValid, attachCookiesToResponse } = require('./jwt')
const createTokenUser = require('./createTokenUser')
const checkPermissions = require('./checkPermissions')
const sendVerificationEmail = require('./sendVerificationEmail')
const sendResetPasswordEmail = require('./sendResetPasswordEmail')
const hashString = require('./createHash')
const handleResponse = require('./handleResponse')
const generateAccessTokenPaypal = require('./generateAccessTokenPaypal')
const isValidCCCD = require('./checkIdCard')
const { Book, Author } = require('../models')
const CustomAPIError = require('../errors')
const PayOS = require('@payos/node')
const { createHmac } = require('crypto')

const payos = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUMKEY
)

 function sortObjDataByKey(object) {
   const orderedObject = Object.keys(object)
     .sort()
     .reduce((obj, key) => {
       obj[key] = object[key]
       return obj
     }, {})
   return orderedObject
 }

 function convertObjToQueryStr(object) {
   return Object.keys(object)
     .filter((key) => object[key] !== undefined)
     .map((key) => {
       let value = object[key]
       // Sort nested object
       if (value && Array.isArray(value)) {
         value = JSON.stringify(value.map((val) => sortObjDataByKey(val)))
       }
       // Set empty string if null
       if ([null, undefined, 'undefined', 'null'].includes(value)) {
         value = ''
       }

       return `${key}=${value}`
     })
     .join('&')
 }

  function isValidData(data, currentSignature, checksumKey) {
    const sortedDataByKey = sortObjDataByKey(data)
    const dataQueryStr = convertObjToQueryStr(sortedDataByKey)
    const dataToSignature = createHmac('sha256', checksumKey)
      .update(dataQueryStr)
      .digest('hex')
    return dataToSignature == currentSignature
  }

const formatPrice = (price) => {
  const VND = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format((price * 1000).toFixed(2))
  return VND
}

const checkPriceValidity = async ({
  book_list,
  tax,
  shipping_fee,
  cart_total,
}) => {
  let orderItems = []
  let subtotal = 0
  for (const book of book_list) {
    const dbBook = await Book.findOne({
      where: { id: book.bookId },
      include: [
        {
          model: Author,
          attributes: ['name'],
        },
      ],
    })
    if (!dbBook) {
      throw new CustomAPIError.NotFoundError(`No book with id : ${book.bookId}`)
    }
    const { title, price, book_img, id, author } = dbBook
    const singleOrderItem = {
      amount: book.amount,
      title,
      price,
      book_img,
      bookId: id,
      author: author.name,
    }
    // add item to order
    orderItems = [...orderItems, singleOrderItem]
    // calculate subtotal
    subtotal += book.amount * price
  }
  // calculate total
  const total = Number(tax) + Number(shipping_fee) + Number(subtotal)

  if (Math.ceil(total) !== Math.ceil(cart_total)) {
    throw new CustomAPIError.BadRequestError(
      'Have different in total price between client and server!'
    )
  }
  return { orderItems, subtotal, total }
}

const convertVNDToUSD = (vndAmount) => {
  const exchangeRate = 24820 
  const usdAmount = vndAmount / exchangeRate
  return usdAmount.toFixed(2) 
}

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
  createTokenUser,
  checkPermissions,
  sendVerificationEmail,
  sendResetPasswordEmail,
  hashString,
  handleResponse,
  generateAccessTokenPaypal,
  isValidCCCD,
  formatPrice,
  checkPriceValidity,
  convertVNDToUSD,
  payos,
  isValidData,
}
