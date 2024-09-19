const { Sequelize, DataTypes, Model } = require('sequelize')
const sequelize = require('../dbconfig')
const bcrypt = require('bcryptjs')

class User extends Model {
  async comparePassword(candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
  }
}

User.init(
  {
    // Model attributes are defined here
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userType: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ['common', 'student'],
      defaultValue: 'common',
    },
    role: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ['admin', 'user'],
      defaultValue: 'user',
    },
    verificationToken: {
      type: DataTypes.STRING,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    verified: {
      type: DataTypes.DATE,
    },
    passwordToken: {
      type: DataTypes.STRING,
    },
    passwordTokenExpirationDate: {
      type: DataTypes.DATE,
    },
    address: {
      type: DataTypes.TEXT,
    },
    phone_number: {
      type: DataTypes.STRING(15),
    },
    user_img: {
      type: DataTypes.STRING,
    },
    gender: {
      type: DataTypes.ENUM(
        'Nam',
        'Nữ',
        'Khác',
      ),
      allowNull: false,
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'user', // We need to choose the model name
    defaultScope: {
      attributes: {
        exclude: ['password'],
      },
    },
    scopes: {
      withPassword: { attributes: { include: ['password'] } },
    },
    hooks: {
      beforeSave: async (user) => {
        if (!user.changed('password')) return
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)
      },
    },
    timestamps: false,
  }
)

module.exports = User
