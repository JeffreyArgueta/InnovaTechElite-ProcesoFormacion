const usuariosService = require('../services/usuarios.service');
const logger = require('../utils/logger');

const getUsuarios = async (req, res, next) => {
  try {
    const usuarios = await usuariosService.getUsuarios();
    logger.info('Handled GET /usuarios request');
    res.status(200).json({
      success: true,
      data: usuarios
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

const getUsuarioById = async (req, res, next) => {
  try {
    const usuario = await usuariosService.getUsuarioById(req.params.id_usuario);
    logger.info(`Handled GET /usuarios/${req.params.id_usuario} request`);
    res.status(200).json({
      success: true,
      data: usuario
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

const createUsuario = async (req, res, next) => {
  try {
    const usuario = await usuariosService.createUsuario(req.body);
    logger.info(`Handled POST /usuarios request`);
    res.status(201).json({
      success: true,
      data: usuario
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

const updateUsuario = async (req, res, next) => {
  try {
    const usuario = await usuariosService.updateUsuario(req.params.id_usuario, req.body);
    logger.info(`Handled PUT /usuarios/${req.params.id_usuario} request`);
    res.status(200).json({
      success: true,
      data: usuario
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


const deleteUsuario = async (req, res, next) => {
  try {
    const usuario = await usuariosService.deleteUsuario(req.params.id_usuario);
    logger.info(`Handled DELETE /usuarios/${req.params.id_usuario} request`);
    res.status(200).json({
      success: true,
      message: 'Peticion aceptada, usuario eliminado',
      data: usuario
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
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario
}
