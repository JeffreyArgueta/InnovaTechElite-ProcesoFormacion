import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getGoogleAuthUrl } from '../api/auth';
import './Login.css';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Mostrar mensaje de éxito si viene desde registro
    if (location.state?.fromRegister) {
      setSuccessMessage('¡Registro exitoso! Ahora inicia sesión con tu cuenta de Google.');
      // Limpiar el mensaje después de 5 segundos
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  }, [location]);

  const handleGoogleAuth = async (isRegister = false) => {
    try {
      setLoading(true);
      setError(null);

      // Obtener la URL de autorización de Google desde el backend
      const url = await getGoogleAuthUrl();

      // Guardar en sessionStorage si es registro o login
      sessionStorage.setItem('authType', isRegister ? 'register' : 'login');
      
      // Redirigir al usuario a la página de autorización de Google
      window.location.href = url;
    } catch (err) {
      console.error('Error en autenticación con Google:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Bienvenido a InnovaTech Elite</h1>
      <p>Inicia sesión o regístrate con tu cuenta de Google</p>
      
      {successMessage && (
        <p className="login-success-message">
          {successMessage}
        </p>
      )}
      
      {error && (
        <p className="login-error-message">
          {error}
        </p>
      )}
      
      <div className="login-buttons">
        <button 
          onClick={() => handleGoogleAuth(false)}
          disabled={loading}
          className="login-button login-button-signin"
        >
          {loading ? 'Cargando...' : 'Iniciar Sesión con Google'}
        </button>

        <button 
          onClick={() => handleGoogleAuth(true)}
          disabled={loading}
          className="login-button login-button-register"
        >
          {loading ? 'Cargando...' : 'Registrarse con Google'}
        </button>
      </div>

      <p className="login-help-text">
        Si es tu primera vez, usa "Registrarse".<br/>
        Si ya tienes cuenta, usa "Iniciar Sesión".
      </p>
    </div>
  );
};

export default Login;
