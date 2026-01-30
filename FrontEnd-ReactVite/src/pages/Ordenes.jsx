import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrdenes, getDetalleOrden } from '../api/ordenes';
import './Ordenes.css';

const Ordenes = () => {
  const navigate = useNavigate();
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrden, setSelectedOrden] = useState(null);
  const [detallesOrden, setDetallesOrden] = useState([]);
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  useEffect(() => {
    // Verificar si hay usuario en localStorage
    const userData = localStorage.getItem('user');
    
    if (!userData) {
      navigate('/login');
      return;
    }

    fetchOrdenes();
  }, [navigate]);

  const fetchOrdenes = async () => {
    try {
      setLoading(true);
      const response = await getOrdenes();
      setOrdenes(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar órdenes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerDetalle = async (orden) => {
    setSelectedOrden(orden);
    setShowModal(true);
    setLoadingDetalle(true);
    
    try {
      const response = await getDetalleOrden(orden.id_orden);
      setDetallesOrden(response.data || []);
    } catch (err) {
      console.error('Error al cargar detalles:', err);
      setDetallesOrden([]);
    } finally {
      setLoadingDetalle(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrden(null);
    setDetallesOrden([]);
  };

  const handleBackToHome = () => {
    navigate('/home');
  };

  const calcularTotalDetalle = () => {
    return detallesOrden.reduce((sum, detalle) => sum + parseFloat(detalle.subtotal || 0), 0).toFixed(2);
  };

  if (loading) {
    return <div className="ordenes-loading">Cargando órdenes...</div>;
  }

  return (
    <div className="ordenes-container">
      <div className="ordenes-header">
        <h1>Gestión de Órdenes</h1>
        <button onClick={handleBackToHome} className="btn-back">
          Volver al Inicio
        </button>
      </div>

      {error && (
        <div className="ordenes-error">
          Error: {error}
        </div>
      )}

      <div className="ordenes-table-container">
        <table className="ordenes-table">
          <thead>
            <tr>
              <th>ID Orden</th>
              <th>ID Usuario</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">No hay órdenes registradas</td>
              </tr>
            ) : (
              ordenes.map((orden) => (
                <tr key={orden.id_orden}>
                  <td>{orden.id_orden}</td>
                  <td>{orden.id_usuario}</td>
                  <td>{new Date(orden.fecha_orden).toLocaleString()}</td>
                  <td>${parseFloat(orden.total).toFixed(2)}</td>
                  <td className="ordenes-actions">
                    <button 
                      onClick={() => handleVerDetalle(orden)}
                      className="btn-detalle"
                    >
                      Ver Detalle
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && selectedOrden && (
        <div className="modal-overlay">
          <div className="modal modal-detalle">
            <div className="modal-header">
              <h2>Detalle de Orden #{selectedOrden.id_orden}</h2>
              <button onClick={handleCloseModal} className="btn-close">×</button>
            </div>
            
            <div className="modal-body">
              <div className="orden-info">
                <p><strong>Usuario:</strong> {selectedOrden.id_usuario}</p>
                <p><strong>Fecha:</strong> {new Date(selectedOrden.fecha_orden).toLocaleString()}</p>
                <p><strong>Total:</strong> ${parseFloat(selectedOrden.total).toFixed(2)}</p>
              </div>

              <h3>Productos</h3>
              
              {loadingDetalle ? (
                <p className="loading-detalle">Cargando detalles...</p>
              ) : detallesOrden.length === 0 ? (
                <p className="no-detalle">No hay productos en esta orden</p>
              ) : (
                <>
                  <table className="detalle-table">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio Unit.</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detallesOrden.map((detalle) => (
                        <tr key={detalle.id_detalle}>
                          <td>{detalle.nombre_juego}</td>
                          <td>{detalle.cantidad}</td>
                          <td>${parseFloat(detalle.precio_unitario).toFixed(2)}</td>
                          <td>${parseFloat(detalle.subtotal).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3" className="total-label">Total:</td>
                        <td className="total-value">${calcularTotalDetalle()}</td>
                      </tr>
                    </tfoot>
                  </table>
                </>
              )}
            </div>

            <div className="modal-footer">
              <button onClick={handleCloseModal} className="btn-cerrar">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ordenes;
