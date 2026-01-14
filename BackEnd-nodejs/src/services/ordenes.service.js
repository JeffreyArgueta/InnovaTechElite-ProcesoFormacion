const { Ordenes, Usuarios, sequelize } = require('../models');
const logger = require('../utils/logger');

const getOrdenes = async () => {
  try {
    const ordenes = await Ordenes.findAll({
      attributes: ['id_orden', 'nombre_completo', 'fecha_orden', 'total'],
      include: [{ model: Usuarios, attributes: ['nombre_completo']}]
    });
    logger.info('Ordenes obtenidas satisfactoriamente', { count: ordenes.length });
    return ordenes;
  } catch (error) {
    logger.error('Error obteniendo Ordenes', { error: error.message });
  }
};

const getOrdenById = async (id) => {
  try {
    const orden = await Ordenes.findByPk(id, {
      attributes: ['id_orden', 'nombre_completo', 'fecha_orden', 'total'],
      include: [{ model: Usuarios, attributes: ['nombre_completo']}]
    });
    if (!orden) {
      const error = new Error('Orden no encontrada');
      error.status = 404;
      throw error;
    }
    logger.info('Orden obtenida satisfactoriamente', { orden_id: id });
    return orden;
  } catch (error) {
    logger.error('Error obteniendo orden', { orden_id: id, error: error.message });
    throw error;
  }
};

const createOrden = async ({ id_usuario }) => {
  const transaction = await sequelize.transaction();
  try {
    const usuario = await Usuarios.findByPk(id_usuario, { transaction });
    if (!usuario) {
      const error = new Error('Usuario no encontrado');
      error.status = 404;
      throw error;
    }

    const orden = await Ordenes.create(
      { id_usuario },
      { transaction }
    );

    await transaction.commit();
    logger.info('Orden creada satisfactoriamente', { usuario_id: id_usuario });
    return orden;
  } catch (error) {
    await transaction.rollback();
    logger.error('Error al crear Orden', { error: error.message });
    throw error;
  }
};

const updateOrden = async (id, { id_usuario }) => {
  const transaction = await sequelize.transaction();
  try {
    const orden = await Ordenes.findByPk(id, { transaction });
    if (!orden) {
      const error = new Error('Orden no encontrada');
      error.status = 404;
      throw error;
    }

    const usuario = await Usuarios.findByPk(id_usuario, { transaction });
    if (!usuario) {
      const error = new Error('Usuario no encontrado');
      error.status = 404;
      throw error;
    }

    await orden.update(
      { id_usuario },
      { transaction }
    )

    await transaction.commit();
    logger.info('Orden actualizada satisfactoriamente', { orden_id: id });
  } catch (error) {
    await transaction.rollback();
    logger.error('Error al actualizar Orden', { error: error.message });
    throw error;
  }
};

const deleteOrden = async (id) => {
  const transaction = await sequelize.transaction();
  try {
    const orden = await Ordenes.findByPk(id, { transaction });
    if (!orden) {
      const error = new Error('Orden no encontrada');
      error.status = 404;
      throw error;
    }

    await orden.destroy({ transaction });
    await transaction.commit();
    logger.info('Orden eliminada satisfactoriamente', { orden_id: id });
    return detalle;
  } catch (error) {
    await transaction.rollback();
    logger.error('Error al eliminar Orden', { error: error.message });
    throw error;
  }
};

module.exports = {
  getOrdenes,
  getOrdenById,
  createOrden,
  updateOrden,
  deleteOrden
}
