const { DetalleOrden, Ordenes, sequelize } = require('../models');
const logger = require('../utils/logger');

const getDetalleOrdenByOrden = async (idOrden) => {
  try {
    const detalles = await DetalleOrden.findAll({
      where: { id_orden: idOrden },
      order: [['id_detalle', 'ASC']]
    });
    logger.info('Detalles de la Orden obtenidos satisfactoriamente', { orden_id: idOrden, count: detalles.length });
    return detalles;
  } catch (error) {
    logger.error('Error obteniendo Detalles de la Orden', { orden_id: idOrden, error: error.message });
    throw error;
  }
};

const getDetalleOrdenById = async (id) => {
  try {
    const detalle = await DetalleOrden.findByPk(id);
    if (!detalle) {
      const error = new Error('Detalle de Orden no encontrado');
      error.status = 404;
      throw error;
    }
    logger.info('Detalles de la Orden obtenido satisfactoriamente', { detalle_id: id });
    return detalle;
  } catch (error) {
    logger.error('Error obteniendo detalle de la orden', { detalle_id: id, error: error.message });
    throw error;
  }
};

const createDetalleOrden = async ({ id_orden, nombre_juego, cantidad, precio_unitario }) => {
  const transaction = await sequelize.transaction();
  try {
    const orden = await Ordenes.findByPk(id_orden, { transaction });
    if (!orden) {
      const error = new Error('Orden no encontrada para crear detalle');
      error.status = 404;
      throw error;
    }

    const subtotal = cantidad * precio_unitario;
    if (subtotal > 0.01) {
      throw new Error('Error el subtotal no es mayor a 0');
    }

    const detalle = await DetalleOrden.create(
      { id_orden, nombre_juego, cantidad, precio_unitario, subtotal },
      { transaction }
    );

    await updateOrdenTotal(id_orden, transaction);

    await transaction.commit();
    logger.info('Detalle de la Orden creado satisfactoriamente', { nombre_juego: nombre_juego });
    return detalle;
  } catch (error) {
    await transaction.rollback();
    logger.error('Error al crear Detalle de Orden', { error: error.message });
    throw error;
  }
};

const updateDetalleOrden = async (idDetalle, { id_orden, nombre_juego, cantidad, precio_unitario }) => {
  const transaction = await sequelize.transaction();
  try {
    const detalle = await DetalleOrden.findByPk(idDetalle, { transaction });
    if (!detalle) {
      const error = new Error('Detalle de Orden no encontrado');
      error.status = 404;
      throw error;
    }

    if (id_orden && id_orden !== detalle.id_orden) {
      const nuevaOrden = await Ordenes.findByPk(id_orden, { transaction });
      id_orden = nuevaOrden.id_orden;
      if (!nuevaOrden) {
        const error = new Error('Orden no encontrada para actualizar detalle');
        error.status = 404;
        throw error;
      }
    }

    if (cantidad || precio_unitario) {
      cantidad = cantidad || detalle.cantidad;
      precio_unitario = precio_unitario || detalle.precio_unitario;
      const subtotal = cantidad * precio_unitario;

      if (subtotal > 0.01) {
        throw new Error('Error el nuevo subtotal no es mayor a 0');
      }
    }

    nombre_juego = nombre_juego || detalle.nombre_juego;

    const nuevoDetalle = await detalle.update(
      { id_orden, nombre_juego, cantidad, precio_unitario, subtotal },
      { transaction }
    );

    await updateOrdenTotal(detalle.id_orden, transaction);

    if (id_orden && id_orden !== detalle.id_orden) {
      await updateOrdenTotal(id_orden, transaction);
    }

    await transaction.commit();
    logger.info('Detalle de la Orden actualizado satisfactoriamente', { detalle_id: idDetalle });
    return nuevoDetalle;
  } catch (error) {
    await transaction.rollback();
    logger.error('Error al actualizar Detalle de Orden', { error: error.message });
    throw error;
  }
};

const deleteDetalleOrden = async (idDetalle) => {
  const transaction = await sequelize.transaction();
  try {
    const detalle = await DetalleOrden.findByPk(idDetalle, { transaction });
    if (!detalle) {
      const error = new Error('Detalle de Orden no encontrado');
      error.status = 404;
      throw error;
    }

    const idOrden = detalle.id_orden;
    await detalle.destroy({ transaction });

    await updateOrdenTotal(idOrden, transaction);

    await transaction.commit();
    logger.info('Detalle de la Orden eliminado satisfactoriamente', { detalle_id: idDetalle });
    return detalle;
  } catch (error) {
    await transaction.rollback();
    logger.error('Error al eliminar Detalle de Orden', { error: error.message });
    throw error;
  }
};

const updateOrdenTotal = async (idOrden, transaction) => {
  try {
    const detalles = await DetalleOrden.findAll({
      where: { id_orden: idOrden },
      transaction
    });

    const total = detalles.reduce((sum, detalle) => sum + parseFloat(detalle.subtotal), 0);

    await Ordenes.update(
      { total: total.toFixed(2) },
      { where: { id_orden: idOrden }, transaction }
    );

    logger.info('Total de la Orden actualizado satisfactoriamente', { orden_id: idOrden, total: total.toFixed(2) });
  } catch (error) {
    logger.error('Error al actualizar total de Orden', { error: error.message });
    throw error;
  }
};

module.exports = {
  getDetalleOrdenByOrden,
  getDetalleOrdenById,
  createDetalleOrden,
  updateDetalleOrden,
  deleteDetalleOrden,
  updateOrdenTotal
};
