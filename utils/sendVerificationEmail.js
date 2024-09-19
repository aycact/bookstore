const sendEmail = require('./sendEmail')

const sendVerificationEmail = async ({
  name,
  email,
  verificationToken,
  origin,
}) => {
  // tạo đường dẫn xác thực
  const verifyEmail = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`
  // message trỏ tới đường dẫn đó
  const message = `<p>Please verify your email here: <a href="${verifyEmail}" >Verify Email</a></p>`

  return sendEmail({
    to: email,
    subject: 'Email Confirmation',
    html: `<h4>Hello, ${name}</h4>${message}`,
  })
}

module.exports = sendVerificationEmail
