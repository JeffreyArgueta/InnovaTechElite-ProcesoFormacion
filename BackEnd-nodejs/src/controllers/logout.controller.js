const logger = require('../utils/logger');
const { NODE_ENV } = require('../config/environment');

const logout = (req, res, next) => {
  try {
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'lax',
    });

    logger.info('Handled POST /auth/logout request');

    res.status(200).json({
      success: true,
      message: 'Sesión cerrada satisfactoriamente'
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Error al cerrar sesión',
    });
    next(error);
  }
};

module.exports = logout;
