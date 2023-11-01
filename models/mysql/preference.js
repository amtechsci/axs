const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Preference extends Model {}

  Preference.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    uid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    cid: {
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
    modelName: 'Preference',
    tableName: 'preference',
    timestamps: false,
    underscored: true
  });

  Preference.associate = (models) => {
    Preference.belongsTo(models.User, {
      foreignKey: 'uid',
      as: 'user'
    });
  };

  return Preference;
};
