// const Sequelize = require('sequelize');
// const COMMON_FUN = require("../utils/utils");
// const CONFIG = require('../../config');

// let options = {
//   host: CONFIG.mysqlDB.HOST,
//   dialect: 'mysql',
//   operatorsAliases: false,
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000
//   },
//   logging: COMMON_FUN.sqlQueryLogs,
//   logging:false,
//   define: {
//     freezeTableName: true
//   }
// }

// /** Creating the sequelize instance **/
// const sequelize = new Sequelize(CONFIG.mysqlDB.NAME, CONFIG.mysqlDB.USER, CONFIG.mysqlDB.PASSWORD, options);

// /** Testing the connection **/
// sequelize.authenticate()
//   .then(function () {
//     console.log('Database Connected at', CONFIG.mysqlDB.HOST);
//   })
//   .catch(function (err) {
//     console.error('Unable to connect to the database:', err);
//   });

// module.exports = sequelize;
