const { sequelize } = require('../config/database');
const Usuarios = require('./usuarios.model');
const Ordenes = require('./ordenes.model');
const DetalleOrden = require('./detalleOrden.model');

// Asociaciones de Usuarios con Ordenes
Usuarios.hasMany(Ordenes, {
  foreignKey: 'id_usuario',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

Ordenes.belongsTo(Usuarios, {
  foreignKey: 'id_usuario',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

// Asociaciones de Ordenes con DetalleOrdenes
Ordenes.hasMany(DetalleOrden, {
  foreignKey: 'id_orden',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

DetalleOrden.belongsTo(Ordenes, {
  foreignKey: 'id_orden',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

module.exports = {
  sequelize,
  Usuarios,
  Ordenes,
  DetalleOrden
};
