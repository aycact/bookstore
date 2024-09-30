const createTokenUser = (user) => {
  return {
    name: user.name,
    email: user.email,
    userId: user.id,
    role: user.role,
    address: user.address,
    phoneNumber: user.phone_number,
    user_img: user.user_img,
    gender: user.gender,
    cccd: user.cccd
  }
}

module.exports = createTokenUser
