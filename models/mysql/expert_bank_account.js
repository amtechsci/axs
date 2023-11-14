const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Expert_bank_account extends Model {}

  Expert_bank_account.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    expert_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bank_name: {
      type: DataTypes.STRING(155),
      allowNull: true
    },
    account_number: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    account_holder_name: {
      type: DataTypes.STRING(155),
      allowNull: true
    },
    ifsc_code: {
      type: DataTypes.STRING(15),
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
    modelName: 'Expert_bank_account',
    tableName: 'expert_bank_account',
    timestamps: false,
    underscored: true
  });

  Expert_bank_account.associate = (models) => {
    Expert_bank_account.belongsTo(models.User, {
      foreignKey: 'expert_id',
      as: 'user'
    });
  };

  return Expert_bank_account;
};
