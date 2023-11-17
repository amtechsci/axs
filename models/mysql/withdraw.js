const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Withdraw extends Model {}

  Withdraw.init({
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
    amount: {
      type: DataTypes.STRING(7),
      allowNull: true
    },
    status: {
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
    modelName: 'Withdraw',
    tableName: 'withdraw',
    timestamps: false,
    underscored: true
  });

  return Withdraw;
};