const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Get_subscription extends Model {}

  Get_subscription.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    plan_name: {
      type: DataTypes.STRING(55),
      allowNull: true
    },
    plan_description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    plan_type: {
      type: DataTypes.STRING(55),
      allowNull: true
    },
    validity: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    price: {
      type: DataTypes.STRING(7),
      allowNull: true
    },
    feature: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    plan_image: {
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
    modelName: 'Get_subscription',
    tableName: 'get_subscription',
    timestamps: false,
    underscored: true
  });

  return Get_subscription;
};
