const { DataTypes } = require('sequelize')
const sequelize = require('../dbconfig') // Đường dẫn tới kết nối cơ sở dữ liệu Sequelize của bạn

const Coupon = sequelize.define(
  'Coupon',
  {
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    discount_type: {
      type: DataTypes.ENUM('percentage', 'fixed_amount'), // Tùy thuộc vào giá trị enum của discount_type_enum
      defaultValue: 'percentage',
      allowNull: false,
    },
    discount_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    min_order_value: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    expiration_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    usage_limit: {
      type: DataTypes.INTEGER,
      defaultValue: 50,
      allowNull: false,
    },
    limit_per_customer: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'expired', 'deactivated'), // Tùy vào discount_status_enum
      defaultValue: 'active',
      allowNull: false,
    },
    stackable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    discount_percentage: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: true,
    },
    applicable_publisher: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'publishers', // Tên bảng publishers
        key: 'id',
      },
      onDelete: 'CASCADE', // Ràng buộc khóa ngoại
    },
  },
  {
    tableName: 'coupon', // Tên bảng
    timestamps: false, // Không có createdAt, updatedAt
  }
)

// Export model
module.exports = Coupon
