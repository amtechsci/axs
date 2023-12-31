const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Executive extends Model {}

  Executive.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(55),
      allowNull: true
    },
    mobile: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    gender: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'male=1, female=2' // Note: Comment here is only for reference; it won't be set in the DB
    },
    profile_img: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    otp: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    pin: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    device_token: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    device_id: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    wallet: {
      type: DataTypes.STRING(7),
      allowNull: true,
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue:1
    },
    user_role: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue:1
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
    modelName: 'Executive',
    tableName: 'executive',
    timestamps: false,
    underscored: true
  });

  return Executive;
};
