/**
 * API de Autenticación
 * Maneja todas las peticiones relacionadas con autenticación de usuarios
 */

const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Obtiene la URL de autorización de Google
 * @returns {Promise<string>} URL de Google OAuth
 */
export const getGoogleAuthUrl = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/google/url`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener URL de Google');
  }

  const data = await response.json();
  
  if (!data.success || !data.data.url) {
    throw new Error('URL de Google no disponible');
  }

  return data.data.url;
};

/**
 * Obtiene la URL de autorización de Microsoft
 * @returns {Promise<string>} URL de Microsoft OAuth
 */
export const getMicrosoftAuthUrl = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/microsoft/url`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener URL de Microsoft');
  }

  const data = await response.json();
  
  if (!data.success || !data.data.url) {
    throw new Error('URL de Microsoft no disponible');
  }

  return data.data.url;
};

/**
 * Autentica con Google (auto-registro si no existe)
 * @param {string} code - Código de autorización de Google
 * @returns {Promise<Object>} Datos del usuario autenticado
 */
export const authenticateWithGoogle = async (code) => {
  const response = await fetch(`${API_BASE_URL}/auth/google/authenticate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ code }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Error al autenticar con Google');
  }

  return data.data.usuario;
};

/**
 * Autentica con Microsoft (auto-registro si no existe)
 * @param {string} code - Código de autorización de Microsoft
 * @returns {Promise<Object>} Datos del usuario autenticado
 */
export const authenticateWithMicrosoft = async (code) => {
  const response = await fetch(`${API_BASE_URL}/auth/microsoft/authenticate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ code }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Error al autenticar con Microsoft');
  }

  return data.data.usuario;
};

/**
 * Cierra la sesión del usuario
 * @returns {Promise<void>}
 */
export const logout = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error al cerrar sesión');
  }
};
