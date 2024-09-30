require('dotenv').config()
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
      type: DataTypes.BLOB,
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
      values: ['common', 'customer'],
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
    email_is_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    email_verified_date: {
      type: DataTypes.DATE,
    },
    passwordToken: {
      type: DataTypes.STRING,
    },
    passwordTokenExpirationDate: {
      type: DataTypes.DATE,
    },
    address: {
      type: DataTypes.BLOB,
    },
    phone_number: {
      type: DataTypes.BLOB,
    },
    user_img: {
      type: DataTypes.STRING,
    },
    gender: {
      type: DataTypes.ENUM('Nam', 'Nữ', 'Khác'),
      defaultValue: 'Nam',
    },
    identity_is_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    identity_verified_date: {
      type: DataTypes.DATE,
    },
    cccd: {
      type: DataTypes.BLOB,
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
        // Mã hóa mật khẩu trước khi lưu vào db
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10)
          user.password = await bcrypt.hash(user.password, salt)
          // Lưu ngày định danh
        }
        if (user.changed('cccd')) {
          user.identity_verified_date = Date.now()
          const result = await sequelize.query(
            'SELECT pgp_sym_encrypt(:cccd, :key) AS encrypted_cccd',
            {
              replacements: {
                cccd: user.cccd,
                key: process.env.ENCRYPTED_KEY, // Khóa mã hóa của bạn
              },
              type: Sequelize.QueryTypes.SELECT,
            }
          )
          user.cccd = result[0].encrypted_cccd
        }
        if (user.changed('phone_number')) {
          const result = await sequelize.query(
            'SELECT pgp_sym_encrypt(:phone_number, :key) AS encrypted_phone_number',
            {
              replacements: {
                phone_number: user.phone_number,
                key: process.env.ENCRYPTED_KEY, // Khóa mã hóa của bạn
              },
              type: Sequelize.QueryTypes.SELECT,
            }
          )
          user.phone_number = result[0].encrypted_phone_number
        }
        if (user.changed('address')) {
          const result = await sequelize.query(
            'SELECT pgp_sym_encrypt(:address, :key) AS encrypted_address',
            {
              replacements: {
                address: user.address,
                key: process.env.ENCRYPTED_KEY, // Khóa mã hóa của bạn
              },
              type: Sequelize.QueryTypes.SELECT,
            }
          )
          user.address = result[0].encrypted_address
        }
        if (user.changed('name')) {
          const result = await sequelize.query(
            'SELECT pgp_sym_encrypt(:name, :key) AS encrypted_name',
            {
              replacements: {
                name: user.name,
                key: process.env.ENCRYPTED_KEY, // Khóa mã hóa của bạn
              },
              type: Sequelize.QueryTypes.SELECT,
            }
          )
          user.name = result[0].encrypted_name
        }
        return
      },
      afterFind: async (users) => {
        if (!users) return

        // Nếu là mảng nhiều user
        if (Array.isArray(users)) {
          for (let user of users) {
            await decryptFields(user)
          }
        } else {
          // Nếu là một đối tượng đơn
          await decryptFields(users)
        }
      },
    },
    timestamps: false,
  }
)

async function decryptFields(user) {
  if (user.name) {
    const result = await sequelize.query(
      'SELECT pgp_sym_decrypt(:encrypted_name, :key) AS decrypted_name',
      {
        replacements: {
          encrypted_name: user.name,
          key: process.env.ENCRYPTED_KEY,
        },
        type: Sequelize.QueryTypes.SELECT,
      }
    )
    console.log(user.name);
    console.log(result[0].decrypted_name)
    user.name = result[0].decrypted_name
  }

  if (user.cccd) {
    const result = await sequelize.query(
      'SELECT pgp_sym_decrypt(:encrypted_cccd, :key) AS decrypted_cccd',
      {
        replacements: {
          encrypted_cccd: user.cccd,
          key: process.env.ENCRYPTED_KEY,
        },
        type: Sequelize.QueryTypes.SELECT,
      }
    )
    user.cccd = result[0].decrypted_cccd
  }

  if (user.address) {
    const result = await sequelize.query(
      'SELECT pgp_sym_decrypt(:encrypted_address, :key) AS decrypted_address',
      {
        replacements: {
          encrypted_address: user.address,
          key: process.env.ENCRYPTED_KEY,
        },
        type: Sequelize.QueryTypes.SELECT,
      }
    )
    user.address = result[0].decrypted_address
  }
  if (user.phone_number) {
    const result = await sequelize.query(
      'SELECT pgp_sym_decrypt(:encrypted_phone_number, :key) AS decrypted_phone_number',
      {
        replacements: {
          encrypted_phone_number: user.phone_number,
          key: process.env.ENCRYPTED_KEY,
        },
        type: Sequelize.QueryTypes.SELECT,
      }
    )
    user.phone_number = result[0].decrypted_phone_number
  }
}

module.exports = User
