const { Model, DataTypes } = require('sequelize')
const sequelize = require('../dbconfig')
const Book = require('./book.model')

class Review extends Model {}

Review.init(
  {
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
        notNull: { msg: 'Please provide rating' },
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Please provide review title' },
        len: {
          args: [0, 100],
          msg: 'Title must be less than or equal to 100 characters',
        },
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: { msg: 'Please provide review text' },
      },
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    book_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'book',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'review',
    tableName: 'reviews',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
)

Review.calculateAverageRating = async function (book_id) {
  const result = await Review.findAll({
    where: { book_id },
    attributes: [
      [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
      [sequelize.fn('COUNT', sequelize.col('id')), 'numOfReviews'],
    ],
    raw: true,
  })

  const averageRating = result[0].averageRating
    ? Math.ceil(result[0].averageRating)
    : 0
  const numOfReviews = result[0].numOfReviews || 0

  try {
    await Book.update(
      {
        average_rating: averageRating,
        num_of_review: numOfReviews,
      },
      {
        where: { id: book_id },
      }
    )
  } catch (error) {
    console.error(error)
  }
}

Review.afterCreate(async (review, options) => {
  await Review.calculateAverageRating(review.book_id)
})

Review.afterUpdate(async (review, options) => {
  await Review.calculateAverageRating(review.book_id)
})

Review.afterDestroy(async (review, options) => {
  await Review.calculateAverageRating(review.book_id)
})

module.exports = Review
