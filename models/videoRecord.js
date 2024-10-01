module.exports = (sequelize, DataTypes) => {
  const VideoRecord = sequelize.define('VideoRecord', {
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER, // Store duration in seconds
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  }, {
    timestamps: true,
  });

  VideoRecord.associate = (models) => {
    VideoRecord.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return VideoRecord;
};
