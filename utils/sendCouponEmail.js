const sendEmail = require('./sendEmail')

const sendCouponEmail = async ({
  name,
  email,
}) => {
  // tạo đường dẫn xác thực
  // message trỏ tới đường dẫn đó
  const message = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Định danh người dùng</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #7e2828; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5e7b2;">
    <div style="background-color: #f9d689; border: 1px solid #e0a75e; border-radius: 5px; padding: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
        <h1 style="font-family: Arial, sans-serif; color: #651f1f;">Định danh thành công</h1>
        <p>Xin chào</p>
        <p>Cảm ơn bạn đã định danh bằng căn cước công dân.</p>
        <p>Xin gửi bạn mã giảm 11% cho 4 đơn hàng đầu tiên trong tháng: <h2>JP-42</h2></p> 
        <p style="font-size: 0.7em;">Chúc một ngày tốt lành,<br>Bookstore3v2t</p>
    </div>
</body>
</html>`

  return sendEmail({
    to: email,
    subject: 'Định danh người dùng',
    html: `<h4>Xin chào ${name}</h4>${message}`,
  })
}

module.exports = sendCouponEmail
