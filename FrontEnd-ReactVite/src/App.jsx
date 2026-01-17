import { useState, useEffect } from 'react'
import './App.css'
import api from './services/api'

function App() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ejemplo de llamada al backend
    const fetchData = async () => {
      try {
        const response = await api.get('/');
        setMessage(response.data.message);
      } catch (error) {
        console.error('Error al conectar con el backend:', error);
        setMessage('Error al conectar con el backend');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <h1>Frontend conectado con Backend</h1>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <p>Mensaje del backend: {message}</p>
      )}
    </>
  )
}

export default App
