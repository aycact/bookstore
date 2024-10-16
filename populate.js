const sequelize = require('./dbconfig')
const coupons = require('./coupons (1).json')
const Coupon = require('./models/coupon.model') 

;(async () => {
  await sequelize.sync()

  // Chèn nhiều bản ghi
  try {
    await Coupon.bulkCreate(coupons)

    console.log('Multiple coupons created')
  } catch (error) {
    console.error('Error creating coupons:', error)
  }
})()
