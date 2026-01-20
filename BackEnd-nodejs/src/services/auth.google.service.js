const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const { Usuarios, sequelize } = require('../models');
const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  JWT_SECRET
} = require('../config/environment');
const logger = require('../utils/logger');

const client = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

const SCOPES = ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'];

// 1. Obtener URL de autorización (redirigir al usuario)
const getGoogleAuthUrl = () => {
  try {
    const url = client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'select_account'
    });
    logger.info('URL de autorización Google generada');
    return url;
  } catch (error) {
    logger.error('Error obteniendo URL Google', { error: error.message });
    const err = new Error('Error obteniendo URL Google');
    err.status = 500;
    throw err;
  }
};

// 2. Intercambiar código por token y obtener información del usuario
const verifyGoogleCode = async (code) => {
  try {
    const { tokens } = await client.getToken({
      code,
      redirect_uri: GOOGLE_REDIRECT_URI
    });

    client.setCredentials(tokens);

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    logger.info('Código Google verificado', { correo: payload.email });

    return {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token || null
    };
  } catch (error) {
    logger.error('Error verificando código Google', { error: error.message });
    const err = new Error('Código Google inválido o expirado');
    err.status = 401;
    throw err;
  }
};

// 3. Generar JWT del usuario
const generateJwtToken = (usuario) => {
  try {
    const payload = {
      id: usuario.id_usuario,
      email: usuario.correo,
      name: usuario.nombre_completo
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    logger.info('JWT generado', { usuario_id: usuario.id_usuario });
    return token;
  } catch (error) {
    logger.error('Error generando JWT', { error: error.message });
    throw error;
  }
};

// 4. Login - solo si el usuario ya existe
const loginWithGoogle = async (code) => {
  const transaction = await sequelize.transaction();
  try {
    const googleData = await verifyGoogleCode(code);

    const usuario = await Usuarios.findOne({
      where: { correo: googleData.email },
      transaction
    });

    if (!usuario) {
      const error = new Error('Usuario no encontrado. Registrate primero');
      error.status = 404;
      throw error;
    }

    const token = generateJwtToken(usuario);
    await transaction.commit();

    logger.info('Login con Google exitoso', { usuario_email: usuario.correo });
    return {
      usuario: {
        id: usuario.id_usuario,
        nombre_completo: usuario.nombre_completo,
        correo: usuario.correo
      },
      token,
    }
  } catch (error) {
    await transaction.rollback();
    logger.error('Error en login con Google', { error: error.message });
    throw error;
  }
};

// 5. Registro - crea usuario si no existe
const registerWithGoogle = async (code) => {
  const transaction = await sequelize.transaction();
  try {
    const googleData = await verifyGoogleCode(code);

    // Verificar si ya existe el usuario por email
    let usuario = await Usuarios.findOne({
      where: { correo: googleData.email },
      transaction
    })

    if (usuario) {
      const error = new Error('Usuario ya está registrado. Inicia sesión');
      error.status = 409;
      throw error;
    }

    // Verificar si ya existe el id_google (por si cambió correo);
    usuario = await Usuarios.findOne({
      where: { id_microsoft: googleData.googleId },
      transaction
    })

    if (usuario) {
      const error = new Error('Cuenta Google ya vinculada a otro usuario');
      error.status = 409;
      throw error;
    }

    usuario = await Usuarios.create({
      nombre_completo: googleData.name,
      correo: googleData.email,
      proveedor_login: 'Google',
      id_microsoft: googleData.googleId
    }, { transaction });

    const token = generateJwtToken(usuario);
    await transaction.commit();

    logger.info('Registro con Google exitoso', { usuario_email: usuario.correo });

    return {
      usuario: {
        id: usuario.id_usuario,
        nombre_completo: usuario.nombre_completo,
        correo: usuario.correo
      },
      token
    }
  } catch (error) {
    await transaction.rollback();
    logger.error('Error en registro con Google', { error: error.message });
    throw error;
  }
};

const authenticateWithGoogle = async (code) => {
  const transaction = await sequelize.transaction();
  try {
    const googleData = await verifyGoogleCode(code);

    // Verificar si ya existe el usuario por email
    let usuario = await Usuarios.findOne({
      where: { correo: googleData.email },
      transaction
    });

    // Búsqueda adicional por googleId (por si cambió de email)
    if (!usuario) {
      usuario = await Usuarios.findOne({
        where: { id_microsoft: googleData.googleId },
        transaction
      });
    }

    // registro si no existe
    if (!usuario) {
      usuario = await Usuarios.create({
        nombre_completo: googleData.name,
        correo: googleData.email,
        proveedor_login: 'Google',
        id_microsoft: googleData.googleId
      }, { transaction });
    }

    // Si llegamos aquí → tenemos un usuario (existente o recién creado)

    const token = generateJwtToken(usuario);
    await transaction.commit();

    logger.info('Autenticación con Google exitosa', { usuario_email: usuario.correo });

    return {
      usuario: {
        id: usuario.id_usuario,
        nombre_completo: usuario.nombre_completo,
        correo: usuario.correo
      },
      token
    }
  } catch (error) {
    await transaction.rollback();
    logger.error('Error en autenticación con Google', { error: error.message });
    throw error;
  }
};

module.exports = {
  getGoogleAuthUrl,
  loginWithGoogle,
  registerWithGoogle,
  authenticateWithGoogle
};
