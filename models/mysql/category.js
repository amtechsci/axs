const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Category extends Model {}

  Category.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    category_name: {
      type: DataTypes.STRING(55),
      allowNull: true
    },
    category_img: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    parent_id: {
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
    modelName: 'Category',
    tableName: 'category',
    timestamps: false,
    underscored: true
  });

  return Category;
};
