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
  const message = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #7e2828; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5e7b2;">
    <div style="background-color: #f9d689; border: 1px solid #e0a75e; border-radius: 5px; padding: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
        <h1 style="font-family: Arial, sans-serif; color: #651f1f;">Xác thực email</h1>
        <p>Xin chào</p>
        <p>Cảm ơn bạn đã đăng ký. Vui lòng xác thực email của bạn bằng cách nhấn vào nút xác thực:</p>
        <p>
            <a href="${verifyEmail}" style="display: inline-block; padding: 10px 20px; background-color: #973131; color: white; text-decoration: none; border-radius: 5px; font-family: Arial, sans-serif; transition: 0.3s ease-in-out all;">Xác thực</a>
        </p>
        <p style="font-size: 0.875rem;">Nếu bạn không yêu cầu xác thực thì bạn có thể bỏ qua mail này.</p>
        <p style="font-size: 0.875rem;">Xác thực hết hạn trong 24 giờ.</p>
        <p style="font-size: 0.7em;">Chúc một ngày tốt lành,<br>Bookstore3v2t</p>
    </div>
</body>
</html>`

  return sendEmail({
    to: email,
    subject: 'Xác thực tài khoản',
    html: `<h4>Xin chào ${name}</h4>${message}`,
  })
}

module.exports = sendVerificationEmail
