const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Chat extends Model {}

  Chat.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    uid: {
      type: DataTypes.STRING(55),
      allowNull: true
    },
    is_chat_bot_active: {
      type: DataTypes.TEXT,
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
    modelName: 'Chat',
    tableName: 'chat',
    timestamps: false,
    underscored: true
  });

  return Chat;
};
