require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()
var morgan = require('morgan')
const path = require('path')

const fileUpload = require('express-fileupload') // xử lí các file được up lên
const cloudinary = require('cloudinary').v2
cloudinary.config({
  // có thể lấy 3 giá trị này trên account cloudinary
  cloud_name: process.env.CLOUD_NAME, //Tên của tài khoản Cloudinary của bạn.
  api_key: process.env.CLOUD_API_KEY, //Khóa API (API Key) của bạn để xác thực với dịch vụ Cloudinary.
  api_secret: process.env.CLOUD_API_SECRET, // Khóa bí mật (API Secret) của bạn để ký và xác thực các yêu cầu đến Cloudinary API
}) // để có thể up lên cloud cần một object gồm 3 properties bắt buộc

const cookieParser = require('cookie-parser') // dùng để đính kèm cookie vào response

// router
const authorRouter = require('./routes/author.router')
const bookRouter = require('./routes/book.router')
const categoryRouter = require('./routes/category.router')
const userRouter = require('./routes/user.router')
const authRouter = require('./routes/auth.router')
const publisherRouter = require('./routes/publisher.router')
const orderRouter = require('./routes/order.router')
const reviewRouter = require('./routes/review.router')
const orderItemRouter = require('./routes/oder_item.router')


// middleware
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

// secure
const rateLimiter = require('express-rate-limit')
const helmet = require('helmet')
const xss = require('xss-clean')
const cors = require('cors')
const mongoSanitize = require('express-mongo-sanitize')

app.use(morgan('tiny'))

app.set('trust proxy', 1)
// app.use(
//   rateLimiter({
//     windowMs: 15 * 60 * 1000,
//     max: 60,
//   })
// )
app.use(helmet())
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://bookstore.ayclqt.id.vn'],
    credentials: true,
  })
)
app.use(xss())
app.use(mongoSanitize())

// app.use(express.static(path.resolve(__dirname, './client/dist', 'index.html')))
app.use(express.static(path.resolve(__dirname, './client/dist')))
app.use(express.json())
app.use(fileUpload({ useTempFiles: true })) // các file dc up lên sẽ lưu trữ trong folder temp
app.use(cookieParser(process.env.JWT_SECRET))
// Trong cookie-parser, đối số đầu tiên được truyền vào là secret key, và nó được sử dụng để ký (sign) cookie. Việc ký cookie giúp đảm bảo tính toàn vẹn của cookie và ngăn chặn bất kỳ sửa đổi nào từ phía máy khách.

app.use('/api/v1/books', bookRouter)
app.use('/api/v1/authors', authorRouter)
app.use('/api/v1/categories', categoryRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/publishers', publisherRouter)
app.use('/api/v1/orders', orderRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/orderItems', orderItemRouter)

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/dist', 'index.html'))
})

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || '5000'
app.listen(port, () => {
  console.log('Server is running on port', port)
})
