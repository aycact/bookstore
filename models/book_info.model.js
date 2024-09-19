const { Sequelize, DataTypes, Model } = require('sequelize')
const sequelize = require('../dbconfig')

class Book_Info extends Model {}

Book_Info.init(
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
      validate: {
        min: 0,
      },
    },
    description: {
      type: DataTypes.TEXT,
    },
    author: {
      type: DataTypes.STRING,
    },
    category: {
      type: DataTypes.STRING,
    },
    publisher: {
      type: DataTypes.STRING,
    },
    book_img: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      validate: {
        min: 1,
      },
      defaultValue: 9999,
    },
  },
  {
    sequelize,
    tableName: 'book_info',
    freezeTableName: true,
    timestamps: false,
  }
)

module.exports = Book_Info
