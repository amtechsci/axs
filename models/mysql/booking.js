const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Booking extends Model {}

  Booking.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    uid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    experience_id: {
      type: DataTypes.INTEGER,
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
    modelName: 'Booking',
    tableName: 'booking',
    timestamps: false,
    underscored: true
  });
  Booking.associate = (models) => {
    Booking.belongsTo(models.Experience, {
      foreignKey: 'experience_id',
      as: 'experience'
    });
  };
  return Booking;
};