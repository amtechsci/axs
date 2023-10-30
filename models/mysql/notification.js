const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Notification extends Model {}

  Notification.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    uid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(55),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(155),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Notification',
    tableName: 'notification',
    timestamps: false,
    underscored: true
  });

  // Relationship
  Notification.associate = (models) => {
    Notification.belongsTo(models.User, {
      foreignKey: 'uid',
      as: 'user'
    });
  };

  return Notification;
};
