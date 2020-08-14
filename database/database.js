const sequeliza = require('sequelize');
const { Sequelize } = require('sequelize');

const connection = new Sequelize('guiaperguntas','root','trocar123',{
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = connection;