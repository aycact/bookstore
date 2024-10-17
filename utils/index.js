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
const { Book, Author, Coupon, UsedCoupon } = require('../models')
const CustomAPIError = require('../errors')
const PayOS = require('@payos/node')
const { createHmac } = require('crypto')
const sendCouponEmail = require('./sendCouponEmail')

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
  shipping_fee,
  cart_total,
  coupon,
  user_id,
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
  let total = (Number(shipping_fee / 1000) + Number(subtotal)).toFixed(3)

  console.log(total)
  console.log(cart_total)

  if (Math.ceil(total) !== Math.ceil(cart_total)) {
    throw new CustomAPIError.BadRequestError(
      'Have different in total price between client and server!'
    )
  }

  if (coupon) {
    const isExistingCoupon = await Coupon.findOne({
      where: {
        code: coupon,
      },
    })
    // kiểm tra coupon có tồn tại không
    if (!isExistingCoupon) {
      throw new CustomAPIError.NotFoundError('Không tìm thấy Coupon')
    }
    // Kiểm tra tính hợp lệ của coupon
    if (
      isExistingCoupon.status === 'expired' ||
      isExistingCoupon.status === 'deactivated'
    )
      throw new CustomAPIError.BadRequestError('Coupon đã hết hạn hoặc đã bị hủy')

    // Kiểm tra giới hạn tối thiểu của giá trị đơn hàn để sử dụng coupon
    console.log(`min: ${isExistingCoupon.min_order_value}`)
    console.log(`total: ${total}`);
    console.log(isExistingCoupon.min_order_value > total)
    
    if (Number(isExistingCoupon.min_order_value) > Number(total)) 
      throw new CustomAPIError.BadRequestError('Cần đạt đủ giá trị đơn hàng tối thiểu')
    // Kiểm tra lượt sử dụng của coupon
    if(!(Number(isExistingCoupon.usage_limit) > 0)) {
       throw new CustomAPIError.BadRequestError('Số lượt sử dụng coupon đã hết')
    }
    // Kiểm tra liên kết giữa người dùng vơi coupon
    const isUsedBefore = await UsedCoupon.findOne({
      where: { user_id, coupon_id: isExistingCoupon.id },
    })
    // Trường hợp đã sử dụng trước đó thì trừ lượt sử dụng
    if (isUsedBefore) {
      if (Number(isUsedBefore.num_times_used) > 0) {
        isUsedBefore.num_times_used -= 1 // trừ 1 lượt sử dụng
        await isUsedBefore.save()
      } else {
        throw CustomAPIError.BadRequestError(
          'Đã sử dụng hết số lượng coupon này của user'
        )
      }
    } else {
      // tạo liên kết
      await UsedCoupon.create({
        user_id,
        coupon_id: isExistingCoupon.id,
        num_times_used: Number(isExistingCoupon.limit_per_customer) - 1,
      })
    }

    if (isExistingCoupon.discount_type === 'percentage') {
      total -= (Number(isExistingCoupon.discount_percentage) / 100) * total
    }
    if (isExistingCoupon.discount_type === 'fixed_amount') {
      total -= Number(isExistingCoupon.discount_amount)
    }
  }
  return {
    orderItems,
    subtotal,
    total: Math.ceil(total),
    coupon_code: coupon || '',
  }
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
  sendCouponEmail,
}
