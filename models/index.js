const Sequelize = require('sequelize');
const config = require('../config/config.js');
const env = process.env.NODE_ENV || 'development';
const sequelize = new Sequelize(config[env].database, config[env].username, config[env].password, {
  host: config[env].host,
  dialect: config[env].dialect
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require('./user')(sequelize, Sequelize);
db.Article = require('./article')(sequelize, Sequelize);
db.Comment = require('./comment')(sequelize, Sequelize);
db.VideoRecord = require('./videoRecord')(sequelize, Sequelize);

// Associations
db.User.hasMany(db.VideoRecord);
db.Article.hasMany(db.Comment);
db.User.hasMany(db.Comment);

module.exports = db;
