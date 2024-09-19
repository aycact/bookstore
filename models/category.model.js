const { Sequelize, DataTypes, Model } = require('sequelize')
const sequelize = require('../dbconfig')

class Category extends Model {}

Category.init(
  {
    // Model attributes are defined here
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'category', // We need to choose the model name
    timestamps: false,
  }
)

module.exports = Category
