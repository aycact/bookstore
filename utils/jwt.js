const jwt = require('jsonwebtoken')

// tạo token
const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET) // ko cần set lifetime vì cookies sẽ giải quyết điều này
  return token
}

// xác nhận token
const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET)

const attachCookiesToResponse = ({ res, user, refreshToken }) => {
  //Tạo 2 token
  const accessTokenJWT = createJWT({ payload: user }) // dùng để truy cập vào secured resources
  const refreshTokenJWT = createJWT({ payload: { user, refreshToken } }) //dùng để refresh access token

  const oneDay = 1000 * 60 * 60 * 24

  res.cookie('accessToken', accessTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // secure sẽ được kích hoạt khi được build thành production
    signed: true,
    maxAge: 1000, // hết hạn trong 1 s
  })
  res.cookie('refreshToken', refreshTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    expires: new Date(Date.now() + oneDay), // 1 ngay
  })
}
const attachSingleCookieToResponse = ({ res, user }) => {
  const token = createJWT({ payload: user })

  const oneDay = 1000 * 60 * 60 * 24

  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  })
}

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
}
