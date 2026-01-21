import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authenticateWithGoogle, authenticateWithMicrosoft } from '../api/auth';
import './AuthCallback.css';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Obtener el código de autorización de la URL
        const code = searchParams.get('code');

        if (!code) {
          console.error('No se recibió código de autorización');
          navigate('/login');
          return;
        }

        // Evitar procesamiento múltiple usando sessionStorage
        const processingKey = `processing_${code}`;
        if (sessionStorage.getItem(processingKey)) {
          return; // Ya se está procesando o ya se procesó este código
        }
        
        // Marcar como procesando
        sessionStorage.setItem(processingKey, 'true');

        // Determinar el proveedor
        const provider = sessionStorage.getItem('authProvider') || 'google';
        sessionStorage.removeItem('authProvider');

        // Autenticar con el proveedor correspondiente (auto-registro incluido)
        let usuario;
        if (provider === 'google') {
          usuario = await authenticateWithGoogle(code);
        } else if (provider === 'microsoft') {
          usuario = await authenticateWithMicrosoft(code);
        }

        // Guardar usuario y redirigir al home
        localStorage.setItem('user', JSON.stringify(usuario));
        
        // Limpiar el código procesado después de un tiempo
        setTimeout(() => sessionStorage.removeItem(processingKey), 5000);
        
        navigate('/home');
      } catch (error) {
        console.error('Error en callback:', error);
        navigate('/login');
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="callback-container">
      <h2>Procesando...</h2>
    </div>
  );
};

export default AuthCallback;
