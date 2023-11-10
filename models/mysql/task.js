const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Task extends Model {}

  Task.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    uid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    expert_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    cid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(55),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    appointment_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    appointment_time: {
      type: DataTypes.TIME,
      allowNull: true
    },
    price: {
      type: DataTypes.STRING(7),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'ongoing=1,complete=2,canceled=3'
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
    modelName: 'Task',
    tableName: 'task',
    timestamps: false,
    underscored: true
  });

  return Task;
};
