import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsuarios, createUsuario, updateUsuario, deleteUsuario } from '../api/usuarios';
import './Usuarios.css';

const Usuarios = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre_completo: '',
    correo: '',
    proveedor_login: 'Microsoft',
    id_microsoft: '',
    estado: true
  });

  useEffect(() => {
    // Verificar si hay usuario en localStorage
    const userData = localStorage.getItem('user');
    
    if (!userData) {
      navigate('/login');
      return;
    }

    fetchUsuarios();
  }, [navigate]);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const response = await getUsuarios();
      setUsuarios(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar usuarios:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleOpenModal = (usuario = null) => {
    if (usuario) {
      setEditingUser(usuario);
      setFormData({
        nombre_completo: usuario.nombre_completo,
        correo: usuario.correo,
        proveedor_login: usuario.proveedor_login,
        id_microsoft: usuario.id_microsoft,
        estado: usuario.estado
      });
    } else {
      setEditingUser(null);
      setFormData({
        nombre_completo: '',
        correo: '',
        proveedor_login: 'Microsoft',
        id_microsoft: '',
        estado: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({
      nombre_completo: '',
      correo: '',
      proveedor_login: 'Microsoft',
      id_microsoft: '',
      estado: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingUser) {
        await updateUsuario(editingUser.id_usuario, formData);
      } else {
        await createUsuario(formData);
      }
      
      handleCloseModal();
      fetchUsuarios();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      return;
    }

    try {
      await deleteUsuario(id);
      fetchUsuarios();
    } catch (err) {
      alert(`Error al eliminar: ${err.message}`);
    }
  };

  const handleBackToHome = () => {
    navigate('/home');
  };

  if (loading) {
    return <div className="usuarios-loading">Cargando usuarios...</div>;
  }

  return (
    <div className="usuarios-container">
      <div className="usuarios-header">
        <h1>Gestión de Usuarios</h1>
        <div className="usuarios-header-buttons">
          <button onClick={handleBackToHome} className="btn-back">
            Volver al Inicio
          </button>
          <button onClick={() => handleOpenModal()} className="btn-add">
            Agregar Usuario
          </button>
        </div>
      </div>

      {error && (
        <div className="usuarios-error">
          Error: {error}
        </div>
      )}

      <div className="usuarios-table-container">
        <table className="usuarios-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre Completo</th>
              <th>Correo</th>
              <th>Proveedor</th>
              <th>Estado</th>
              <th>Fecha Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">No hay usuarios registrados</td>
              </tr>
            ) : (
              usuarios.map((usuario) => (
                <tr key={usuario.id_usuario}>
                  <td>{usuario.id_usuario}</td>
                  <td>{usuario.nombre_completo}</td>
                  <td>{usuario.correo}</td>
                  <td>{usuario.proveedor_login}</td>
                  <td>
                    <span className={`estado-badge ${usuario.estado ? 'activo' : 'inactivo'}`}>
                      {usuario.estado ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>{new Date(usuario.fecha_registro).toLocaleDateString()}</td>
                  <td className="usuarios-actions">
                    <button 
                      onClick={() => handleOpenModal(usuario)}
                      className="btn-edit"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(usuario.id_usuario)}
                      className="btn-delete"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
              <button onClick={handleCloseModal} className="btn-close">×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="nombre_completo">Nombre Completo *</label>
                <input
                  type="text"
                  id="nombre_completo"
                  name="nombre_completo"
                  value={formData.nombre_completo}
                  onChange={handleInputChange}
                  required
                  maxLength={150}
                />
              </div>

              <div className="form-group">
                <label htmlFor="correo">Correo Electrónico *</label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleInputChange}
                  required
                  maxLength={150}
                />
              </div>

              <div className="form-group">
                <label htmlFor="proveedor_login">Proveedor de Login *</label>
                <select
                  id="proveedor_login"
                  name="proveedor_login"
                  value={formData.proveedor_login}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Microsoft">Microsoft</option>
                  <option value="Google">Google</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="id_microsoft">ID del Proveedor *</label>
                <input
                  type="text"
                  id="id_microsoft"
                  name="id_microsoft"
                  value={formData.id_microsoft}
                  onChange={handleInputChange}
                  required
                  maxLength={200}
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="estado"
                    checked={formData.estado}
                    onChange={handleInputChange}
                  />
                  Usuario Activo
                </label>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={handleCloseModal} className="btn-cancel">
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  {editingUser ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;
