const detalleOrdenService = require('../services/detalleOrden.service');
const logger = require('../utils/logger');

const getDetalleOrdenByOrden = async (req, res, next) => {
  try {
    const detalles = await detalleOrdenService.getDetalleOrdenByOrden(req.params.id_orden);
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

const createDetalleOrden = async (req, res, next) => {
  try {
    const detalle = await detalleOrdenService.createDetalleOrden(req.body);
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

const updateDetalleOrden = async (req, res, next) => {
  try {
    const detalle = await detalleOrdenService.updateDetalleOrden(req.params.id_detalle, req.body);
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

const deleteDetalleOrden = async (req, res, next) => {
  try {
    const detalle = await detalleOrdenService.deleteDetalleOrden(req.params.id_detalle);
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
  getDetalleOrdenByOrden,
  getDetalleOrdenById,
  createDetalleOrden,
  updateDetalleOrden,
  deleteDetalleOrden
};
