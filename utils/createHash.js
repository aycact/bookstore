const crypto = require('crypto')
const hashString = (string) => {
  return crypto.createHash('md5').update(string).digest('hex')
} // hash token de luu vao db
//Kết quả của phương thức này là một chuỗi hex biểu diễn của giá trị băm MD5.

module.exports = hashString
