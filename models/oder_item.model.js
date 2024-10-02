const { Sequelize, DataTypes, Model } = require('sequelize')
const sequelize = require('../dbconfig')

class OderItem extends Model {}

OderItem.init(
  {
    book_id: {
        type: DataTypes.UUID,
        references: {
            model: 'book',
            key: 'id',
        }
    },
    user_id: {
      type: DataTypes.UUID,
      references: {
        model: 'user',
        key: 'id',
      },
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'order_item', // We need to choose the model name
    tableName: 'order_items', // We need to choose the table name
    timestamps: false,
  }
)

module.exports = OderItem
