const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Expert_slots extends Model {}

  Expert_slots.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    uid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sub_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    purchase_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    validity_till: {
      type: DataTypes.DATE,
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
    modelName: 'Expert_slots',
    tableName: 'expert_slots',
    timestamps: false,
    underscored: true
  });

  Expert_slots.associate = (models) => {
    Expert_slots.belongsTo(models.User, {
      foreignKey: 'expert_id',
      as: 'user'
    });
  };

  return Expert_slots;
};
