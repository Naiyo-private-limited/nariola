module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      }
    }, {
      timestamps: true
    });
  
    return Comment;
  };
  