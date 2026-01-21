import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import AuthCallback from './pages/AuthCallback'
import Home from './pages/Home'

function App() {
  return (
    <Routes>
      {/* Ruta por defecto redirige al login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Ruta de login */}
      <Route path="/login" element={<Login />} />
      
      {/* Ruta de callback después de autenticar con Google */}
      <Route path="/auth/callback" element={<AuthCallback />} />
      
      {/* Ruta protegida - página principal */}
      <Route path="/home" element={<Home />} />
    </Routes>
  )
}

export default App
