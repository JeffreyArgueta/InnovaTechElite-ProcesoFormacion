const { Usuarios, sequelize } = require('../models');
const logger = require('../utils/logger');

const getUsuarios = async () => {
  try {
    const usuarios = await Usuarios.findAll({
      attributes: ['id_usuario', 'nombre_completo', 'correo', 'estado']
    });
    logger.info('Usuarios obtenidos satisfactoriamente', { count: usuarios.length });
    return usuarios;
  } catch (error) {
    logger.error('Error obteniendo usuarios', { error: error.message });
    throw error;
  }
};

const getUsuarioById = async (id) => {
  try {
    const usuario = await Usuarios.findByPk(id, {
      attributes: ['id_usuario', 'nombre_completo', 'correo', 'estado']
    });
    if (!usuario) {
      const error = new Error('Usuario no encontrado');
      error.status = 404;
      throw error;
    }
    logger.info('Usuario obtenido satisfactoriamente', { id_usuario: id });
    return usuario;
  } catch (error) {
    logger.error('Error obteniendo usuario', { id_usuario: id, error: error.message });
    throw error;
  }
};

const createUsuario = async ({ nombre_completo, correo, proveedor_login, id_microsoft, estado }) => {
  const transaction = await sequelize.transaction();
  try {
    const usuario = await Usuarios.create(
      { nombre_completo, correo, proveedor_login, id_microsoft, estado },
      { transaction }
    );
    await transaction.commit();
    logger.info('Usuario creado satisfactoriamente', { id_usuario: usuario.id_usuario, correo_usuario: usuario.correo });
    return usuario;
  } catch (error) {
    await transaction.rollback();
    logger.error('Error creando usuario', { error: error.message });
    throw error;
  }
};

const updateUsuario = async (id, { nombre_completo, correo, proveedor_login, id_microsoft, estado }) => {
  const transaction = await sequelize.transaction();
  try {
    const usuario = await Usuarios.findByPk(id, { transaction });
    if (!usuario) {
      const error = new Error('Usuario no encontrado para actualizar');
      error.status = 404;
      throw error;
    }

    await usuario.update(
      { nombre_completo, correo, proveedor_login, id_microsoft, estado },
      { transaction }
    );

    await transaction.commit();
    logger.info('Usuario actualizado satisfactoriamente', { id_usuario: usuario.id_usuario, correo_usuario: usuario.correo });
    return usuario;
  } catch (error) {
    await transaction.rollback();
    logger.error('Error actualizando usuario', { error: error.message });
    throw error;
  }
};

const deleteUsuario = async (id) => {
  const transaction = await sequelize.transaction();
  try {
    const usuario = await Usuarios.findByPk(id, { transaction });

    if (!usuario) {
      const error = new Error('Usuario no encontrado para actualizar');
      error.status = 404;
      throw error;
    }

    await usuario.destroy({ transaction });
    await transaction.commit();

    logger.info('Usuario eliminado satisfactoriamente', { id_usuario: id });
    return usuario;
  } catch (error) {
    await transaction.rollback();
    logger.error('Error eliminando usuario', { id_usuario: id, error: error.message });
    throw error;
  }
};

module.exports = {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario
}
