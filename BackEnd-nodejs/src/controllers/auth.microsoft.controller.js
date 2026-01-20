const authMicrosoftService = require('../services/auth.microsoft.service');
const logger = require('../utils/logger');
const { NODE_ENV } = require('../config/environment');

const getMicrosoftAuthUrl = async (req, res, next) => {
  try {
    const url = await authMicrosoftService.getMicrosoftAuthUrl();
    logger.info('Handled GET /auth/microsoft/url request');
    res.status(200).json({
      success: true,
      data: { url }
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message,
      data: null
    });
    next(error);
  }
};

const loginWithMicrosoft = async (req, res, next) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'El parámetro "code" es requerido',
        data: null
      });
    }

    const { usuario, token } = await authMicrosoftService.loginWithMicrosoft(code);

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 1 día
    });

    logger.info('Handled POST /auth/microsoft/login request', { usuario_id: usuario.id });

    res.status(200).json({
      success: true,
      message: 'Inicio de sesión con Microsoft exitoso',
      data: { usuario }
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Error al iniciar sesión con Microsoft',
      data: null
    });
    next(error);
  }
};

const registerWithMicrosoft = async (req, res, next) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'El parámetro "code" es requerido',
        data: null
      });
    }

    const { usuario, token } = await authMicrosoftService.registerWithMicrosoft(code);

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 1 día
    });

    logger.info('Handled POST /auth/microsoft/register request', { usuario_id: usuario.id });

    res.status(201).json({
      success: true,
      message: 'Registro con Microsoft exitoso',
      data: { usuario }
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Error al registrar con Microsoft',
      data: null
    });
    next(error);
  }
};

const authenticateWithMicrosoft = async (req, res, next) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'El parámetro "code" es requerido',
        data: null
      });
    }

    const { usuario, token } = await authMicrosoftService.authenticateWithMicrosoft(code);

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    logger.info('Handled POST /auth/microsoft/authenticate request', { usuario_id: usuario.id });

    res.status(201).json({
      success: true,
      message: 'Autenticación con Microsoft existosa',
      data: { usuario }
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Error al autenticar con Microsoft',
      data: null
    });
    next(error);
  }
};

const getMicrosoftCallback = async (req, res, next) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'No se recibió código de autorización',
        code: null
      });
    }

    logger.info('Handled GET /auth/microsoft/callback request');

    res.status(200).json({
      success: true,
      message: 'Código de autorización recibido correctamente desde Microsoft',
      code: code
    });
  } catch (error) {
    logger.error('Error en callback Microsoft', { error: error.message });
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Error al procesar callback de Microsoft',
      code: null
    });
    next(error);
  }
};

module.exports = {
  getMicrosoftAuthUrl,
  loginWithMicrosoft,
  registerWithMicrosoft,
  authenticateWithMicrosoft,
  getMicrosoftCallback
};
