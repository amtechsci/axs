const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Chatbot extends Model {}

  Chatbot.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    base_prompt: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    modelName: 'Chatbot',
    tableName: 'chatbot',
    timestamps: false,
    underscored: true
  });

  return Chatbot;
};
