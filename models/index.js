const Author = require('./author.model')
const Book = require('./book.model')
const Order = require('./order.model')
const Category = require('./category.model')
const User = require('./user.model')
const Publisher = require('./publisher.model')
const Token = require('./token.model')
const Review = require('./review.model')
const OrderItem = require('./oder_item.model')
const Coupon = require('./coupon.model')
const UsedCoupon = require('./used_coupon')

Author.hasMany(Book, { foreignKey: 'author_id' })
Book.belongsTo(Author, { foreignKey: 'author_id' })

Category.hasMany(Book, { foreignKey: 'category_id' })
Book.belongsTo(Category, { foreignKey: 'category_id' })

Publisher.hasMany(Book, { foreignKey: 'publisher_id' })
Book.belongsTo(Publisher, { foreignKey: 'publisher_id' })

User.hasMany(Order, { foreignKey: 'user_id' })
Order.belongsTo(User, { foreignKey: 'user_id' })

User.hasMany(Review, { foreignKey: 'user_id' })
Review.belongsTo(User, { foreignKey: 'user_id'})

Book.hasMany(Review, { foreignKey: 'book_id' })
Review.belongsTo(Book, { foreignKey: 'book_id' })

User.hasMany(OrderItem, { foreignKey: 'user_id' })
OrderItem.belongsTo(User, { foreignKey: 'user_id' })

Book.hasMany(OrderItem, { foreignKey: 'book_id' })
OrderItem.belongsTo(Book, { foreignKey: 'book_id' })

Publisher.hasMany(Coupon, { foreignKey: 'applicable_publisher' })
Coupon.belongsTo(Publisher, { foreignKey: 'applicable_publisher' })

Coupon.hasMany(UsedCoupon, { foreignKey: 'coupon_id' })
UsedCoupon.belongsTo(Coupon, { foreignKey: 'coupon_id' })

User.hasMany(UsedCoupon, { foreignKey: 'user_id' })
UsedCoupon.belongsTo(User, { foreignKey: 'user_id' })


module.exports = {
  Author,
  Book,
  Order,
  Category,
  User,
  Publisher,
  Token,
  Review,
  OrderItem,
  Coupon,
  UsedCoupon,
}
