import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../api/auth';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verificar si hay usuario en localStorage
    const userData = localStorage.getItem('user');
    
    if (!userData) {
      // Si no hay usuario, redirigir al login
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = async () => {
    try {
      // Llamar al endpoint de logout
      await logout();

      // Limpiar localStorage
      localStorage.removeItem('user');
      
      // Redirigir al login
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Limpiar de todas formas
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  if (!user) {
    return <div className="home-loading">Cargando...</div>;
  }

  const handleNavigateToUsuarios = () => {
    navigate('/usuarios');
  };

  const handleNavigateToOrdenes = () => {
    navigate('/ordenes');
  };

  return (
    <div className="home-container">
      <h1>Bienvenido a InnovaTech Elite</h1>
      
      <div className="home-user-card">
        <h2>Información del Usuario</h2>
        <p><strong>Nombre:</strong> {user.nombre_completo}</p>
        <p><strong>Email:</strong> {user.correo}</p>
        <p><strong>Proveedor:</strong> {user.proveedor_login}</p>
        <p><strong>Estado:</strong> {user.estado ? 'Activo' : 'Inactivo'}</p>
      </div>

      <div className="home-buttons">
        <button 
          onClick={handleNavigateToUsuarios}
          className="home-usuarios-button"
        >
          Gestionar Usuarios
        </button>

        <button 
          onClick={handleNavigateToOrdenes}
          className="home-ordenes-button"
        >
          Ver Órdenes
        </button>

        <button 
          onClick={handleLogout}
          className="home-logout-button"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default Home;
