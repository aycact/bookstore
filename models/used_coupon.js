const { DataTypes } = require('sequelize')
const sequelize = require('../dbconfig') // Đường dẫn tới kết nối cơ sở dữ liệu Sequelize của bạn

const UsedCoupon = sequelize.define(
  'UsedCoupon',
  {
    user_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users', // Tên bảng users trong cơ sở dữ liệu
        key: 'id',
      },
      onDelete: 'CASCADE', // Khi xóa user, bản ghi sẽ bị xóa theo
    },
    coupon_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'coupon', // Tên bảng coupon trong cơ sở dữ liệu
        key: 'id',
      },
    },
    num_times_used: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
    },
  },
  {
    tableName: 'used_coupon', // Tên bảng
    timestamps: false, // Không có cột createdAt, updatedAt
  }
)

// Export model
module.exports = UsedCoupon
