const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Time_slots extends Model {}

  Time_slots.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    slot_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: true
    },
    end_time: {
      type: DataTypes.TIME,
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
    modelName: 'Time_slots',
    tableName: 'time_slots',
    timestamps: false,
    underscored: true
  });

  Time_slots.associate = (models) => {
    Time_slots.belongsTo(models.Expert_slots, {
      foreignKey: 'slot_id',
      as: 'expert_slots'
    });
  };

  return Time_slots;
};