const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class User_subscription extends Model {}

  User_subscription.init({
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
    modelName: 'User_subscription',
    tableName: 'user_subscription',
    timestamps: false,
    underscored: true
  });

  User_subscription.associate = (models) => {
    User_subscription.belongsTo(models.Get_subscription, {
      foreignKey: 'sub_id',
      as: 'get_subscription'
    });
  };

  return User_subscription;
};
