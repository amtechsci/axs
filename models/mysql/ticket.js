const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Ticket extends Model {}

  Ticket.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    uid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    chat_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    executive_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    task_id: {
      type: DataTypes.INTEGER,
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
    modelName: 'Ticket',
    tableName: 'ticket',
    timestamps: false,
    underscored: true
  });

  // Task.associate = (models) => {
  //   Task.belongsTo(models.Task, {
  //     foreignKey: 'cid',
  //     as: 'category'
  //   });
  // };

  return Ticket;
};