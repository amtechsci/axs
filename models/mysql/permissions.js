const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Permissions extends Model {}

  Permissions.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    permission: {
      type: DataTypes.STRING(25),
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
    modelName: 'Permissions',
    tableName: 'permissions',
    timestamps: false,
    underscored: true
  });

  return Permissions;
};