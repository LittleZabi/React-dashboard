const { configDotenv } = require('dotenv');
const Sequelize = require('sequelize')

configDotenv();
module.exports.sequelize = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
// alzainmh_condb
// 3@K[@8y_HclO
// alzainmh_super