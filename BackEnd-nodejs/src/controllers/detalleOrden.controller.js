const detalleOrdenService = require('../services/detalleOrdenes.service');
const logger = require('../utils/logger');

const getDetallesOrdenByOrden = async (req, res, next) => {
  try {
    const detalles = await detalleOrdenService.getDetallesPorOrden(req.params.id_orden);
    logger.info(`Handled GET /ordenes/detalles/${req.params.id_orden} request`);
    res.status(200).json({
      success: true,
      data: detalles
    });
  } catch (error) {
    res.status(error.status).json({
      success: false,
      message: error.message,
      data: null
    });
    next(error);
  }
};

const getDetalleOrdenById = async (req, res, next) => {
  try {
    const detalle = await detalleOrdenService.getDetalleOrdenById(req.params.id_detalle);
    logger.info(`Handled GET /ordenes/detalles/${req.params.id_detalle} request`);
    res.status(200).json({
      success: true,
      data: detalle
    });
  } catch (error) {
    res.status(error.status).json({
      success: false,
      message: error.message,
      data: null
    });
    next(error);
  }
};

const createDetalleOrdenes = async (req, res, next) => {
  try {
    const detalle = await detalleOrdenService.createDetalleOrdenes(req.body);

    logger.info(`Handled POST /ordenes/detalles request`);
    res.status(201).json({
      success: true,
      data: detalle,
    });
  } catch (error) {
    res.status(error.status).json({
      success: false,
      message: error.message,
      data: null
    });
    next(error);
  }
};

const updateDetalleOrdenes = async (req, res, next) => {
  try {
    const detalle = await detalleOrdenService.updateDetalleOrdenes(req.params.id_detalle, req.body);
    logger.info(`Handled PUT /ordenes/detalles/${req.params.id_detalle} request`);
    res.status(200).json({
      success: true,
      data: detalle,
    });
  } catch (error) {
    res.status(error.status).json({
      success: false,
      message: error.message,
      data: null
    });
    next(error);
  }
};

const deleteDetalleOrdenes = async (req, res, next) => {
  try {
    const detalle = await detalleOrdenService.deleteDetalleOrdenes(req.params.id_detalle);
    logger.info(`Handled DELETE /ordenes/detalles/${req.params.id_detalle} request`);
    res.status(200).json({
      success: true,
      message: 'Peticion aceptada, detalle de orden eliminado',
      data: detalle
    });
  } catch (error) {
    res.status(error.status).json({
      success: false,
      message: error.message,
      data: null
    });
    next(error);
  }
};

module.exports = {
  getDetallesOrdenByOrden,
  getDetalleOrdenById,
  createDetalleOrdenes,
  updateDetalleOrdenes,
  deleteDetalleOrdenes
};
