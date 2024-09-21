const { Sequelize, DataTypes, Model } = require('sequelize')
const sequelize = require('../dbconfig')

class Book extends Model {
}

Book.init(
  {
    // Model attributes are defined here
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    publication_date: {
      type: DataTypes.DATE,
    },
    available_copies: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    description: {
      type: DataTypes.TEXT,
    },
    author_id: {
      type: DataTypes.UUID,
      references: {
        model: 'author',
        key: 'id',
      },
    },
    category_id: {
      type: DataTypes.UUID,
      references: {
        model: 'category',
        key: 'id',
      },
    },
    publisher_id: {
      type: DataTypes.UUID,
      references: {
        model: 'publisher',
        key: 'id',
      },
    },
    book_img: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      validate: {
        min: 1
      },
      defaultValue: 9999,
    }
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'book', // We need to choose the model name
    timestamps: false,
  }
)

// the defined model is the class itself
module.exports = Book
