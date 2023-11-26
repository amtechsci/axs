const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Roles extends Model {}

  Roles.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    role_type: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    permissions: {
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
    modelName: 'Roles',
    tableName: 'roles',
    timestamps: false,
    underscored: true
  });

  return Roles;
};