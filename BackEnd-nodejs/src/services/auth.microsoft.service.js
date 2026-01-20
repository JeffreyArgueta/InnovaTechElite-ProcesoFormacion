const msal = require('@azure/msal-node');
const jwt = require('jsonwebtoken');
const { Usuarios, sequelize } = require('../models');
const {
  MICROSOFT_CLIENT_ID,
  MICROSOFT_CLIENT_SECRET,
  MICROSOFT_REDIRECT_URI,
  MICROSOFT_TENANT_ID,
  JWT_SECRET
} = require('../config/environment');
const logger = require('../utils/logger');

// Configuración de MSAL para Authorization Code Flow (confidential client)
const msalConfig = {
  auth: {
    clientId: MICROSOFT_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${MICROSOFT_TENANT_ID}`,
    clientSecret: MICROSOFT_CLIENT_SECRET,
    redirectUri: MICROSOFT_REDIRECT_URI,
  },
  system: {
    loggerOptions: {
      loggerCallback(logLevel, message) {
        logger.info(message);
      },
      logLevel: msal.LogLevel.Info,
      piiLoggingEnabled: false
    }
  }
};

const pca = new msal.ConfidentialClientApplication(msalConfig);

const SCOPES = ['openid', 'profile', 'email', 'offline_access'];

// 1. Obtener URL de autorización (redirigir al usuario)
const getMicrosoftAuthUrl = async () => {
  try {
    const url = await pca.getAuthCodeUrl({
      scopes: SCOPES,
      redirectUri: MICROSOFT_REDIRECT_URI,
      prompt: 'select_account', // similar a Google
    });
    logger.info('URL de autorización Microsoft generada');
    return url;
  } catch (error) {
    logger.error('Error obteniendo URL Microsoft', { error: error.message });
    const err = new Error('Error obteniendo URL Microsoft');
    err.status = 500;
    throw err;
  }
};

// 2. Intercambiar código por tokens y obtener información del usuario
const verifyMicrosoftCode = async (code) => {
  try {
    const response = await pca.acquireTokenByCode({
      code,
      scopes: SCOPES,
      redirectUri: MICROSOFT_REDIRECT_URI,
    });

    // response contiene: accessToken, idToken, account, etc.
    const idTokenClaims = response.idTokenClaims || response.account;

    if (!idTokenClaims?.sub || !idTokenClaims?.email) {
      throw new Error('No se encontraron claims necesarios en el id_token');
    }

    logger.info('Código Microsoft verificado', { correo: idTokenClaims.email });

    return {
      microsoftId: idTokenClaims.sub,
      email: idTokenClaims.email,
      name: idTokenClaims.name || idTokenClaims.given_name,
      accessToken: response.accessToken,
      refreshToken: response.refreshToken || null
    };
  } catch (error) {
    logger.error('Error verificando código Microsoft', { error: error.message });
    const err = new Error('Código Microsoft inválido o expirado');
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
const loginWithMicrosoft = async (code) => {
  const transaction = await sequelize.transaction();
  try {
    const msData = await verifyMicrosoftCode(code);

    const usuario = await Usuarios.findOne({
      where: { correo: msData.email },
      transaction
    });

    if (!usuario) {
      const error = new Error('Usuario no encontrado. Regístrate primero');
      error.status = 404;
      throw error;
    }

    const token = generateJwtToken(usuario);
    await transaction.commit();

    logger.info('Login con Microsoft exitoso', { usuario_email: usuario.correo });

    return {
      usuario: {
        id: usuario.id_usuario,
        nombre_completo: usuario.nombre_completo,
        correo: usuario.correo
      },
      token,
    };
  } catch (error) {
    await transaction.rollback();
    logger.error('Error en login con Microsoft', { error: error.message });
    throw error;
  }
};

// 5. Registro - crea usuario si no existe
const registerWithMicrosoft = async (code) => {
  const transaction = await sequelize.transaction();
  try {
    const msData = await verifyMicrosoftCode(code);

    // Verificar si ya existe el usuario por email
    let usuario = await Usuarios.findOne({
      where: { correo: msData.email },
      transaction
    });

    if (usuario) {
      const error = new Error('Usuario ya está registrado. Inicia sesión');
      error.status = 409;
      throw error;
    }

    // Verificar por microsoftId (por si cambió de correo)
    usuario = await Usuarios.findOne({
      where: { id_microsoft: msData.microsoftId },
      transaction
    });

    if (usuario) {
      const error = new Error('Cuenta Microsoft ya vinculada a otro usuario');
      error.status = 409;
      throw error;
    }

    usuario = await Usuarios.create({
      nombre_completo: msData.name,
      correo: msData.email,
      proveedor_login: 'Microsoft',
      id_microsoft: msData.microsoftId
    }, { transaction });

    const token = generateJwtToken(usuario);
    await transaction.commit();

    logger.info('Registro con Microsoft exitoso', { usuario_email: usuario.correo });

    return {
      usuario: {
        id: usuario.id_usuario,
        nombre_completo: usuario.nombre_completo,
        correo: usuario.correo
      },
      token
    };
  } catch (error) {
    await transaction.rollback();
    logger.error('Error en registro con Microsoft', { error: error.message });
    throw error;
  }
};

const authenticateWithMicrosoft = async (code) => {
  const transaction = await sequelize.transaction();
  try {
    const msData = await verifyMicrosoftCode(code);

    // Verificar si ya existe el usuario por email
    let usuario = await Usuarios.findOne({
      where: { correo: msData.email },
      transaction
    });

    // Búsqueda adicional por microsoftId (por si cambió de email)
    if (!usuario) {
      usuario = await Usuarios.findOne({
        where: { id_microsoft: msData.microsoftId },
        transaction
      });
    }

    // registro si no existe
    if (!usuario) {
      usuario = await Usuarios.create({
        nombre_completo: msData.name,
        correo: msData.email,
        proveedor_login: 'Microsoft',
        id_microsoft: msData.microsoftId
      }, { transaction });
    }

    // Si llegamos aquí → tenemos un usuario (existente o recién creado)

    const token = generateJwtToken(usuario);
    await transaction.commit();

    logger.info('Autenticación con Microsoft exitosa', { usuario_email: usuario.correo });

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
    logger.error('Error en autenticación con Microsoft', { error: error.message });
    throw error;
  }
};

module.exports = {
  getMicrosoftAuthUrl,
  loginWithMicrosoft,
  registerWithMicrosoft,
  authenticateWithMicrosoft
};
