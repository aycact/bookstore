const sendEmail = require('./sendEmail.js')

const sendResetPasswordEmail = async ({ name, email, token, origin }) => {
  const resetUrl = `${origin}/user/reset-password?token=${token}&email=${email}`
  const message = `<p>Nhấn vào để thay đổi mật khẩu: <a href="${resetUrl}">Reset Password</a></p>`
  return sendEmail({
    to: email,
    subject: 'Thay đổi mật khẩu',
    html: `<h4>Xin chào ${name}</h4>${message}`,
  })
}

module.exports = sendResetPasswordEmail
