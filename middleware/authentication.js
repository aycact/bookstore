const CustomError = require('../errors')
const { isTokenValid, attachCookiesToResponse } = require('../utils')
const Token = require('../models/token.model')
const { logout } = require('../controllers/auth.controller')

const authenticateUser = async (req, res, next) => {
  const { accessToken, refreshToken } = req.signedCookies
  try {
    // Kiểm tra access token có valid ko
    if (accessToken) {
      const payload = isTokenValid(accessToken)
      req.user = payload.user
      return next()
    }
    // Kiểm tra refresh token có valid ko
    const payload = isTokenValid(refreshToken)
    const existingToken = await Token.findOne({
      where: {
        user: payload.user.userId,
        refreshToken: payload.refreshToken,
      },
    })
    
    // Kiểm tra token có tôn tại nếu có thì có valid ko
    if (!existingToken || !existingToken?.isValid)
      throw new CustomError.UnauthenticatedError('Authentication Invalid')

    if(existingToken.ip !== req.ip) {
      existingToken.destroy()
      throw new CustomError.UnauthenticatedError('Có ai đó đã đăng nhập vào tài khoản bằng thiết bị khác!')
    }
    
    attachCookiesToResponse({
      res,
      user: payload.user,
      refreshToken: existingToken.refreshToken,
    })
    req.user = payload.user
    next()
  } catch (error) {
    throw new CustomError.UnauthenticatedError(error)
  }
}

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        'Unauthorized to access this route'
      )
    }
    next()
  }
}

module.exports = {
  authenticateUser,
  authorizePermissions,
}
