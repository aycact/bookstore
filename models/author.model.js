const { Sequelize, DataTypes, Model } = require('sequelize')
const sequelize = require('../dbconfig')

class Author extends Model {}

Author.init(
  {
    // Model attributes are defined here
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    bio: {
      type: DataTypes.STRING,
    },
    authorImg: {
      type: DataTypes.STRING,
    },
  },
  {
   
    sequelize, 
    modelName: 'author', 
    timestamps: false,
  }
)


module.exports = Author
