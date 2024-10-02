const { Sequelize, DataTypes, Model } = require('sequelize')
const sequelize = require('../dbconfig')
const Book = require('./book.model')
const OrderItem = require('./oder_item.model')

class Order extends Model {}

Order.init(
  {
    customer_email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shipping_address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    recipient_name: {
      type: DataTypes.STRING,
    },
    recipient_phone: {
      type: DataTypes.STRING(15),
    },
    payment_method: {
      type: DataTypes.ENUM('COD', 'Card', 'E-Wallet', 'Bank Transfer'),
      allowNull: false,
      defaultValue: 'COD',
    },
    card_number: {
      type: DataTypes.STRING(20),
    },
    card_expiry_date: {
      type: DataTypes.DATE,
    },
    card_cvv: {
      type: DataTypes.CHAR(3),
    },
    e_wallet_info: {
      type: DataTypes.STRING,
    },
    book_list: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    special_instructions: {
      type: DataTypes.TEXT,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    shipping_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    tax: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        'pending',
        'paid',
        'failed',
        'delivered',
        'cancelled'
      ),
      allowNull: false,
      defaultValue: 'pending',
    },
    terms_accepted: {
      type: DataTypes.BOOLEAN,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    client_secret: {
      type: DataTypes.STRING,
    },
    payment_intent_id: {
      type: DataTypes.STRING,
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
    defaultScope: {
      attributes: {
        exclude: ['client_secret', 'payment_intent_id'],
      },
    },
    scopes: {
      withPassword: {
        attributes: { include: ['client_secret', 'payment_intent_id'] },
      },
    },
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
)

Order.afterUpdate(async (order, options) => {
  if (order.status === 'paid') {
    const bookList = order.book_list
    for (const item of bookList) {
      const book = await Book.findByPk(item.bookID)
      if (book) {
        try {
          book.available_copies -= parseInt(item.amount)
          await book.save()
          const orderItem = await OrderItem.findOne({
            where: { user_id: order.user_id, book_id: book.id },
          })
          if (!orderItem) {
            await OrderItem.create({
              user_id: order.user_id,
              book_id: book.id,
            })
          }
        } catch (error) {
          console.error(error)
        }
      }
    }
  }
})

module.exports = Order
