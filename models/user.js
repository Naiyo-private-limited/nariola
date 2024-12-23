const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    accountType: {
      type: DataTypes.ENUM('standard', 'premium'),
      allowNull: false,
      defaultValue: 'standard', // Default to 'standard'
    },
    emergencyContacts: {
      type: DataTypes.ARRAY(DataTypes.STRING), // Max 12 emergency contacts
      allowNull: true,
    },
    liveLocationLink: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    timestamps: true
  });

  // User.beforeCreate(async (user) => {
  //   user.password = await bcrypt.hash(user.password, 10);
  // });

  return User;
};
