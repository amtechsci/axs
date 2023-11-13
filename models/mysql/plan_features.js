const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Plan_features extends Model {}

  Plan_features.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
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
    modelName: 'Plan_features',
    tableName: 'plan_features',
    timestamps: false,
    underscored: true
  });

  return Plan_features;
};