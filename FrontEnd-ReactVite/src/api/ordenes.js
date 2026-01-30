const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Obtener todas las órdenes
export const getOrdenes = async () => {
  try {
    const response = await fetch(`${API_URL}/api/ordenes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener órdenes');
    }

    return data;
  } catch (error) {
    console.error('Error en getOrdenes:', error);
    throw error;
  }
};

// Obtener orden por ID
export const getOrdenById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/ordenes/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener orden');
    }

    return data;
  } catch (error) {
    console.error('Error en getOrdenById:', error);
    throw error;
  }
};

// Obtener detalles de una orden
export const getDetalleOrden = async (id_orden) => {
  try {
    const response = await fetch(`${API_URL}/api/ordenes/detalles/orden/${id_orden}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener detalles de la orden');
    }

    return data;
  } catch (error) {
    console.error('Error en getDetalleOrden:', error);
    throw error;
  }
};
