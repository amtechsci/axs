const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Expert_skills extends Model {}

  Expert_skills.init({
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
    experience: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    one_hour_price: {
      type: DataTypes.STRING(7),
      allowNull: true
    },
    half_hour_price: {
      type: DataTypes.STRING(7),
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
    modelName: 'Expert_skills',
    tableName: 'expert_skills',
    timestamps: false,
    underscored: true
  });

  Expert_skills.associate = (models) => {
    Expert_skills.belongsTo(models.User, {
      foreignKey: 'cid',
      as: 'user'
    });
  };

  return Expert_skills;
};