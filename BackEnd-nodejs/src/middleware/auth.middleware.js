const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/environment');

const authMiddleware = (req, res, next) => {
  const token = req.cookies.auth_token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Acceso denegado: No se proporcionó token',
      error: 'No token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado',
      error: error.message
    });
  }
};

module.exports = authMiddleware;
