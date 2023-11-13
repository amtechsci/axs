const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Expert_documents extends Model {}

  Expert_documents.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    uid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    document_name: {
      type: DataTypes.STRING(155),
      allowNull: true
    },
    document_file: {
      type: DataTypes.STRING(155),
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
    modelName: 'Expert_documents',
    tableName: 'expert_documents',
    timestamps: false,
    underscored: true
  });

  return Expert_documents;
};