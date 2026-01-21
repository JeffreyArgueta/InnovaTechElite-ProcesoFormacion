import { useState } from 'react';
import { getGoogleAuthUrl, getMicrosoftAuthUrl } from '../api/auth';
import './Login.css';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAuth = async (provider) => {
    try {
      setLoading(true);
      setError(null);

      // Obtener la URL de autorización según el proveedor
      let url;
      if (provider === 'google') {
        url = await getGoogleAuthUrl();
      } else if (provider === 'microsoft') {
        url = await getMicrosoftAuthUrl();
      }

      // Guardar el proveedor en sessionStorage
      sessionStorage.setItem('authProvider', provider);
      
      // Redirigir al usuario a la página de autorización
      window.location.href = url;
    } catch (err) {
      console.error(`Error en autenticación con ${provider}:`, err);
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Bienvenido a InnovaTech Elite</h1>
      <p>Inicia sesión con tu cuenta preferida</p>
      
      {error && (
        <p className="login-error-message">
          {error}
        </p>
      )}
      
      <div className="login-buttons">
        <button 
          onClick={() => handleAuth('google')}
          disabled={loading}
          className="login-button login-button-google"
        >
          {loading ? 'Cargando...' : 'Iniciar Sesión con Google'}
        </button>

        <button 
          onClick={() => handleAuth('microsoft')}
          disabled={loading}
          className="login-button login-button-microsoft"
        >
          {loading ? 'Cargando...' : 'Iniciar Sesión con Microsoft'}
        </button>
      </div>
    </div>
  );
};

export default Login;
