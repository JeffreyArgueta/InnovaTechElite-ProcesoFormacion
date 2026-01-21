import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loginWithGoogle, registerWithGoogle } from '../api/auth';
import './AuthCallback.css';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Procesando autenticación...');
  const hasProcessed = useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      // Evitar ejecución múltiple (problema de StrictMode en desarrollo)
      if (hasProcessed.current) {
        return;
      }
      hasProcessed.current = true;

      try {
        // 1. Obtener el código de autorización de la URL
        const code = searchParams.get('code');

        if (!code) {
          setStatus('Error: No se recibió código de autorización');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // 2. Determinar si es login o registro
        const authType = sessionStorage.getItem('authType') || 'login';
        sessionStorage.removeItem('authType');

        setStatus(`Código recibido, ${authType === 'register' ? 'registrando' : 'autenticando'} con el servidor...`);

        // 3. Llamar a la función correspondiente
        let usuario;
        if (authType === 'register') {
          usuario = await registerWithGoogle(code);
          // Si es registro, redirigir al login
          setStatus('¡Registro exitoso! Ahora inicia sesión con tu cuenta...');
          setTimeout(() => navigate('/login', { state: { fromRegister: true } }), 2000);
        } else {
          usuario = await loginWithGoogle(code);
          // Si es login, guardar usuario y redirigir al home
          setStatus('¡Autenticación exitosa! Redirigiendo...');
          localStorage.setItem('user', JSON.stringify(usuario));
          setTimeout(() => navigate('/home'), 1000);
        }
      } catch (error) {
        console.error('Error en callback:', error);
        setStatus(`Error: ${error.message}`);
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="callback-container">
      <h2>{status}</h2>
      <p>Por favor espera...</p>
    </div>
  );
};

export default AuthCallback;
