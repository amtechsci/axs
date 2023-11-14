const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};
const sequelize = require('../config/mysql');

const loadModels = (dir) => {
  fs
    .readdirSync(dir)
    .forEach(file => {
      const filepath = path.join(dir, file);
      if (fs.statSync(filepath).isDirectory()) {
        loadModels(filepath); // Recursively load models
      } else if (file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js') {
        const model = require(filepath)(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
      }
    });
};

loadModels(__dirname);

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;