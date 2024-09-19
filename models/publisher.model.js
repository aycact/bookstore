const { Sequelize, DataTypes, Model } = require('sequelize')
const sequelize = require('../dbconfig')

class Publisher extends Model {}

Publisher.init(
  {
    // Model attributes are defined here
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'publisher', // We need to choose the model name
    timestamps: false,
  }
)

module.exports = Publisher
