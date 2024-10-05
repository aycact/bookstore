const { createJWT, isTokenValid, attachCookiesToResponse } = require('./jwt')
const createTokenUser = require('./createTokenUser')
const checkPermissions = require('./checkPermissions')
const sendVerificationEmail = require('./sendVerificationEmail')
const sendResetPasswordEmail = require('./sendResetPasswordEmail')
const hashString = require('./createHash')
const handleResponse = require('./handleResponse')
const generateAccessTokenPaypal = require('./generateAccessTokenPaypal')
const isValidCCCD = require('./checkIdCard')

const formatPrice = (price) => {
  const VND = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format((price * 1000).toFixed(2))
  return VND
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
}
