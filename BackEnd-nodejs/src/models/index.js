const { sequelize } = require('../config/database');
const Usuarios = require('./usuarios.model');
const Ordenes = require('./ordenes.model');

Ordenes.belongsTo(Usuarios, {
  foreignKey: 'id_usuario',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
})

module.exports = {
  sequelize,
  Usuarios,
  Ordenes
};
