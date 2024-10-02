const { User, Token } = require('../models')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const {
  createTokenUser,
  attachCookiesToResponse,
  checkPermissions,
  isValidCCCD,
} = require('../utils')
const cloudinary = require('cloudinary').v2
const fs = require('fs')
const tesseract = require('node-tesseract-ocr')

const asyncWrapper = require('../middleware/async')

const getAllUsers = asyncWrapper(async (req, res) => {
  console.log(req.user)
  const users = await User.findAll({ where: { role: 'user' } })
  res.status(StatusCodes.OK).json({ users })
})

const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id })
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id : ${req.params.id}`)
  }
  checkPermissions(req.user, user.id)
  res.status(StatusCodes.OK).json({ user })
}

const showCurrentUser = async (req, res) => {
  const user = await User.findByPk(req.user.userId)
  res
    .status(StatusCodes.OK)
    .json({
      name: user.name,
      phone_number: user.phone_number || "",
      gender: user?.gender,
      address: user?.address || "",
      user_img: user?.user_img,
      cccd: user?.cccd || "",

    })
}
// update user with user.save()
const updateUser = asyncWrapper(async (req, res) => {
  const { name, phone_number, gender, address } = req.body
  if (!name || !phone_number || !gender || !address) {
    throw new CustomError.BadRequestError('Please provide all values')
  }
  const user = await User.findOne({ where: { id: req.user.userId } })
  if (req.files?.user_img) {
    const result = await cloudinary.uploader.upload(
      req.files.user_img.tempFilePath, // file dc lưu tạm thời trong đường dẫn này
      { use_filename: true, folder: 'file-upload' } // up lên file upload trên cloudinary
    )
    fs.unlinkSync(req.files.user_img.tempFilePath)
    user.user_img = result.secure_url
  }

  user.name = name
  user.phone_number = phone_number
  user.gender = gender
  user.address = address

  await user.save()
  await user.reload()

  const existingToken = await Token.findOne({
    where: {
      user: req.user.userId,
    },
  })

  const tokenUser = createTokenUser(user)
  attachCookiesToResponse({
    res,
    user: tokenUser,
    refreshToken: existingToken.refreshToken,
  })
  res.status(StatusCodes.OK).json({ user: tokenUser })
})

const updateUserIdCard = async (req, res) => {
  const config = {
    lang: 'vie',
    oem: 1,
    psm: 3,
  }

  const { cccd } = req.body
  if (!cccd) {
    throw new CustomError.BadRequestError('Xin hãy nhập số CCCD!')
  }
  if (!isValidCCCD(cccd)) {
    throw new CustomError.BadRequestError('Số CCCD không hợp lệ!')
  }
  if (!req.files?.cccd_img) {
    throw new CustomError.BadRequestError('Xin hãy tải ảnh CCCD!')
  }

  const text = await tesseract.recognize(
    req.files.cccd_img?.tempFilePath,
    config
  )

  if (!text.includes(cccd)) {
    throw new CustomError.BadRequestError(
      'Số CCCD đã điền và trên ảnh không trùng khớp hoặc ảnh bị mờ. Xin hãy tải lại!'
    )
  }

  const user = await User.findOne({ where: { id: req.user.userId } })
  user.cccd = cccd
  user.userType = 'customer'
  await user.save()
  await user.reload()
  res.status(StatusCodes.OK).json({msg: 'Định danh thành công'})
}

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError('Please provide both values')
  }
  const user = await User.scope('withPassword').findOne({
    where: { id: req.user.userId },
  })

  const isPasswordCorrect = await user.comparePassword(oldPassword)
  // Kiểm tra password nhập với password trong db có tương thích
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError(
      'Password incorrect. Please try again!'
    )
  }
  user.password = newPassword
  await user.save()
  res.status(StatusCodes.OK).json({ msg: 'Success! Password Updated.' })
}

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
  updateUserIdCard,
}

// update user with findOneAndUpdate
// const updateUser = async (req, res) => {
//   const { email, name } = req.body;
//   if (!email || !name) {
//     throw new CustomError.BadRequestError('Please provide all values');
//   }
//   const user = await User.findOneAndUpdate(
//     { _id: req.user.userId },
//     { email, name },
//     { new: true, runValidators: true }
//   );
//   const tokenUser = createTokenUser(user);
//   attachCookiesToResponse({ res, user: tokenUser });
//   res.status(StatusCodes.OK).json({ user: tokenUser });
// };
