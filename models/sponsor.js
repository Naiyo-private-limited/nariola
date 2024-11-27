module.exports = (sequelize, DataTypes) => {
    const Sponsor = sequelize.define('Sponsor', {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      timestamps: true
    });
  
    return Sponsor;
  };
  