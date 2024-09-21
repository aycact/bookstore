const { User } = require('../models')
const Token = require('../models/token.model')
const {
  attachCookiesToResponse,
  createTokenUser,
  sendVerificationEmail,
  sendResetPasswordEmail,
  hashString,
} = require('../utils')
const crypto = require('crypto')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')

const register = async (req, res) => {
  const { email, name, password } = req.body

  const emailAlreadyExists = await User.findOne({ where: { email: email } })
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('Email already exists')
  }

  // first registered user is an admin
  const isFirstAccount = (await User.count()) === 0
  const role = isFirstAccount ? 'admin' : 'user'

  // tạo token xác thực qua mail
  const verificationToken = crypto.randomBytes(40).toString('hex')

  const user = await User.create({
    name,
    email,
    password,
    role,
    verificationToken,
  })

  const origin = 'http://localhost:5173' // origin là host front-end ko nên nhầm lẫn với host phía back-end
  // sau khi host lên nền tảng hỗ trợ sẽ thay đổi origin

  const tempOrigin = req.get('origin')
  const protocol = req.protocol
  const host = req.get('host')
  const forwardedHost = req.get('x-forwarded-host')
  const forwardedProtocol = req.get('x-forwarded-proto')

  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    verificationToken,
    origin,
  }) // truyền vào thông tin người nhận, token xác thực và host của front-end
  res.status(StatusCodes.CREATED).json({
    msg: 'Success! Please check your email to verify account',
    verificationToken: user.verificationToken,
  })
}

const login = async (req, res) => {
  const { email, password } = req.body
  // Kiểm tra email và password nhập vào
  if (!email || !password) {
    throw new CustomError.BadRequestError('Please provide email and password')
  }
  const user = await User.scope('withPassword').findOne({ where: { email } })
  // Kiểm tra sự tồn tại của user
  if (!user) {
    throw new CustomError.UnauthenticatedError('Can not find user!')
  }
  const isPasswordCorrect = await user.comparePassword(password)
  // Kiểm tra password nhập với password trong db có tương thích
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError(
      'Password incorrect. Please try again!'
    )
  }
  // Kiểm tra xem user có xác thực qua email chưa
  if (!user.isVerified)
    throw new CustomError.UnauthenticatedError('Please verify your email')

  const tokenUser = createTokenUser(user) // đống gói một số thông tin cần thiết để đưa vào payload

  let refreshToken = ''
  // Tìm token của user nếu đã tồn tại
  const existingToken = await Token.findOne({ where: { user: user.id } })
  // Kiểm tra token đã tồn tại trong db chưa
  if (existingToken) {
    // Kiểm tra xem token có valid ko
    if (!existingToken.isValid)
      throw new CustomError.UnauthenticatedError('Invalid Credentials')
    refreshToken = existingToken.refreshToken
    attachCookiesToResponse({ res, user: tokenUser, refreshToken }) // tiếp tọc sử dụng refresh token đó
    res
      .status(StatusCodes.OK)
      .json({ user: { ...tokenUser, isVerified: user.isVerified } })
    return
  }
  // trường hợp chưa tồn tại refresh token
  refreshToken = crypto.randomBytes(40).toString('hex')
  const ip = req.ip
  const userAgent = req.headers['user-agent']

  const userToken = { refreshToken, ip, userAgent, user: user.id }

  //Lưu token vào csdl tuy nhiên chỉ là tạm thời cho đến khi user đăng xuất
  await Token.create(userToken)

  attachCookiesToResponse({ res, user: tokenUser, refreshToken })

  res.status(StatusCodes.OK).json({ user: tokenUser })
}
const logout = async (req, res) => {
  // Xóa token trong db khi logout
  const tokens = await Token.findAll({ where: { user: req.user.userId } })
  for (const token of tokens) {
    token.destroy()
  }
  // Xóa 2 cookies token khi logout
  res.cookie('refreshToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  })
  res.cookie('accessToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  })
  res.status(StatusCodes.OK).json({ msg: 'user logged out!' })
}

const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body // post sẽ được thục hiện ở front-end bằng cách lấy token và email để post thông qua query string(đường dẫn cung cấp trong email)
  // Tim user bằng email
  const user = await User.findOne({ where: { email } })
  if (!user)
    throw new CustomError.UnauthenticatedError(`No user with email: ${email}`)
  if (user.isVerified) {
    throw new CustomError.BadRequestError(
      `Your email has already been verified`
    )
  }
  // so sánh token của user với token được cấp
  if (verificationToken !== user.verificationToken)
    throw new CustomError.UnauthenticatedError(
      `User token does not match verification token: ${verificationToken}`
    )
  user.isVerified = true
  user.verified = Date.now()
  user.verificationToken = ''
  await user.save()
  res.status(StatusCodes.OK).json({ msg: "Email's verified completely!" })
}

const forgotPassword = async (req, res) => {
  const { email } = req.body

  if (!email)
    throw new CustomError.BadRequestError('Please provide a valid email')

  const user = await User.findOne({ where: { email: email } })

  if (user) {
    const passwordToken = crypto.randomBytes(70).toString('hex')

    const origin = 'http://localhost:3000'
    await sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      token: passwordToken,
      origin,
    })

    const tenMinutes = 1000 * 60 * 10
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes) // thời hạn của temp password la 10 phut
    user.passwordToken = hashString(passwordToken) // hash token truoc khi luu vao db de khi db bi xam nhap attacker cung khong biet duoc gia tri thuc cua token
    user.passwordTokenExpirationDate = passwordTokenExpirationDate
    user.save()
  }
  res
    .status(StatusCodes.OK)
    .json({ msg: 'Please check your email and change your password' })
} // trả về 200 dù có tìm được người dùng hay ko tránh việc attacker chèn email để nhận biết email có trong db ko

const resetPassword = async (req, res) => {
  const { token, email, password } = req.body
  if (!token || !email || !password)
    throw new CustomError.BadRequestError('Please provide all valid values')

  const user = await User.scope('withPassword').findOne({ where: { email } })
  if (user) {
    const currentDate = new Date()
    if (
      user.passwordToken === hashString(token) &&
      user.passwordTokenExpirationDate > currentDate
    ) {
      user.password = password
      user.passwordToken = null
      user.passwordTokenExpirationDate = null
      await user.save()
    }
  }

  res.status(StatusCodes.OK).json({ msg: 'Change password successfully ' })
}

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
}
