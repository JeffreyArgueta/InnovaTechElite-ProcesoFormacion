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
 * Inicia sesión con Google usando el código de autorización
 * @param {string} code - Código de autorización de Google
 * @returns {Promise<Object>} Datos del usuario autenticado
 */
export const loginWithGoogle = async (code) => {
  const response = await fetch(`${API_BASE_URL}/auth/google/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ code }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Error al iniciar sesión');
  }

  return data.data.usuario;
};

/**
 * Registra un nuevo usuario con Google
 * @param {string} code - Código de autorización de Google
 * @returns {Promise<Object>} Datos del usuario registrado
 */
export const registerWithGoogle = async (code) => {
  const response = await fetch(`${API_BASE_URL}/auth/google/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ code }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Error al registrar usuario');
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
