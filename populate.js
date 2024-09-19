const sequelize = require('./dbconfig')
const Book = require('./models/book.model')
const books = require('./books.json')
const author = require('./author_data.json')
const Author = require('./models/author.model')

;(async () => {
  await sequelize.sync()

  // Chèn nhiều bản ghi
  try {
    await Book.bulkCreate(books)

    console.log('Multiple books created')
  } catch (error) {
    console.error('Error creating books:', error)
  }
})()
