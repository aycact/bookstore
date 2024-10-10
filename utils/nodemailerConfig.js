module.exports = {
  host: 'smtp.gmail.com',
  // host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
}
