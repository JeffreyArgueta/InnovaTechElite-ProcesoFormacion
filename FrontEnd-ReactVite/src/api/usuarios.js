const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Obtener todos los usuarios
export const getUsuarios = async () => {
  try {
    const response = await fetch(`${API_URL}/api/usuarios`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener usuarios');
    }

    return data;
  } catch (error) {
    console.error('Error en getUsuarios:', error);
    throw error;
  }
};

// Obtener usuario por ID
export const getUsuarioById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/usuarios/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener usuario');
    }

    return data;
  } catch (error) {
    console.error('Error en getUsuarioById:', error);
    throw error;
  }
};

// Crear nuevo usuario
export const createUsuario = async (usuarioData) => {
  try {
    const response = await fetch(`${API_URL}/api/usuarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(usuarioData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al crear usuario');
    }

    return data;
  } catch (error) {
    console.error('Error en createUsuario:', error);
    throw error;
  }
};

// Actualizar usuario
export const updateUsuario = async (id, usuarioData) => {
  try {
    const response = await fetch(`${API_URL}/api/usuarios/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(usuarioData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al actualizar usuario');
    }

    return data;
  } catch (error) {
    console.error('Error en updateUsuario:', error);
    throw error;
  }
};

// Eliminar usuario
export const deleteUsuario = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/usuarios/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al eliminar usuario');
    }

    return data;
  } catch (error) {
    console.error('Error en deleteUsuario:', error);
    throw error;
  }
};
