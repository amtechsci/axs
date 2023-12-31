const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Expert_slots extends Model {}

  Expert_slots.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    expert_id : {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    date: {
      type: DataTypes.STRING(15),
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
    is_active: {
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
