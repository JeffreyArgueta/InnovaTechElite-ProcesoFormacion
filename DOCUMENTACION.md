# 📘 Documentación Completa: Conexión Frontend-Backend con OAuth Google

## 🎯 Objetivo
Este documento explica paso a paso cómo se conecta el **frontend (React + Vite)** con el **backend (Node.js + Express)** para implementar un sistema de autenticación usando **Google OAuth 2.0** mediante peticiones **fetch**.

---

## 📋 Tabla de Contenidos
1. [Arquitectura del Sistema](#arquitectura-del-sistema)
2. [Flujo de Autenticación OAuth](#flujo-de-autenticación-oauth)
3. [Configuración del Backend](#configuración-del-backend)
4. [Configuración del Frontend](#configuración-del-frontend)
5. [Consumo de APIs con Fetch](#consumo-de-apis-con-fetch)
6. [Manejo de Sesiones](#manejo-de-sesiones)
7. [Rutas y Navegación](#rutas-y-navegación)
8. [Testing y Troubleshooting](#testing-y-troubleshooting)

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────┐         HTTP/HTTPS        ┌─────────────────┐
│                 │ ◄─────────────────────────► │                 │
│  Frontend React │         Fetch API          │  Backend Node   │
│  (Puerto 5173)  │                            │  (Puerto 3000)  │
│                 │                            │                 │
└────────┬────────┘                            └────────┬────────┘
         │                                              │
         │                                              │
         ▼                                              ▼
┌─────────────────┐                            ┌─────────────────┐
│  Google OAuth   │                            │   MySQL DB      │
│                 │                            │  (projectBD)    │
└─────────────────┘                            └─────────────────┘
```

### Componentes Principales

**Frontend:**
- React 18 con Vite
- React Router DOM para navegación
- Fetch API nativo para peticiones HTTP

**Backend:**
- Node.js con Express
- Google OAuth Library
- MySQL con Sequelize ORM
- JWT para tokens de sesión
- Cookie-parser para manejo de cookies

---

## 🔐 Flujo de Autenticación OAuth

### Paso a Paso Detallado

```
Usuario                Frontend              Backend              Google OAuth
  │                       │                     │                      │
  │  1. Click botón       │                     │                      │
  │─────────────────────► │                     │                      │
  │                       │                     │                      │
  │                       │  2. GET /auth/      │                      │
  │                       │     google/url      │                      │
  │                       │────────────────────►│                      │
  │                       │                     │                      │
  │                       │  3. {url: "https:// │                      │
  │                       │     accounts.google │                      │
  │                       │     .com/o/oauth2"} │                      │
  │                       │◄────────────────────│                      │
  │                       │                     │                      │
  │                       │  4. Redirect        │                      │
  │                       │────────────────────────────────────────────►│
  │                                             │                      │
  │  5. Usuario autoriza                        │                      │
  │◄────────────────────────────────────────────────────────────────────│
  │                                             │                      │
  │  6. Redirect con ?code=ABC123               │                      │
  │─────────────────────►│                     │                      │
  │                       │                     │                      │
  │                       │  7. POST /auth/     │                      │
  │                       │     google/login    │                      │
  │                       │     {code: "ABC"}   │                      │
  │                       │────────────────────►│                      │
  │                       │                     │                      │
  │                       │                     │  8. Verify code      │
  │                       │                     │─────────────────────►│
  │                       │                     │                      │
  │                       │                     │  9. User info +      │
  │                       │                     │     tokens           │
  │                       │                     │◄─────────────────────│
  │                       │                     │                      │
  │                       │                     │ 10. Save to DB       │
  │                       │                     │      + Generate JWT  │
  │                       │                     │                      │
  │                       │ 11. {success: true, │                      │
  │                       │      usuario: {...},│                      │
  │                       │      + cookie}      │                      │
  │                       │◄────────────────────│                      │
  │                       │                     │                      │
  │                       │ 12. Redirect /home  │                      │
  │  13. Sesión activa    │                     │                      │
  │◄──────────────────────│                     │                      │
```

### Explicación de Cada Paso

#### **Paso 1-3: Obtener URL de Google**

**Frontend (Login.jsx):**
```javascript
const handleGoogleLogin = async () => {
  // Hacer petición GET al backend para obtener la URL de autorización
  const response = await fetch('http://localhost:3000/api/auth/google/url', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  const data = await response.json();
  // data = { success: true, data: { url: "https://accounts.google.com/o/oauth2/v2/auth?..." } }
}
```

**Backend (auth.google.service.js):**
```javascript
const getGoogleAuthUrl = () => {
  const url = client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ],
    prompt: 'select_account',
  });
  return url;
};
```

**¿Qué sucede?**
1. El frontend solicita al backend que genere una URL de autorización
2. El backend usa la biblioteca de Google OAuth para crear una URL especial
3. Esta URL contiene:
   - El `client_id` de tu aplicación
   - Los permisos que necesitas (scopes)
   - La URL de redirección (GOOGLE_REDIRECT_URI)
   - Un state token para seguridad

#### **Paso 4-6: Autorización en Google**

**Frontend:**
```javascript
if (data.success && data.data.url) {
  // Redirigir al usuario a Google
  window.location.href = data.data.url;
}
```

**¿Qué sucede?**
1. El navegador redirige al usuario a Google
2. El usuario ve la pantalla de "Iniciar sesión con Google"
3. El usuario selecciona su cuenta y acepta los permisos
4. Google redirige de vuelta a: `http://localhost:5173/auth/callback?code=ABC123XYZ`

#### **Paso 7-11: Intercambio de Código por Token**

**Frontend (AuthCallback.jsx):**
```javascript
useEffect(() => {
  const handleCallback = async () => {
    // 1. Extraer el código de la URL
    const code = searchParams.get('code');
    
    // 2. Enviar el código al backend
    const response = await fetch('http://localhost:3000/api/auth/google/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // IMPORTANTE: Para recibir cookies
      body: JSON.stringify({ code }),
    });
    
    const data = await response.json();
    
    // 3. Guardar usuario en localStorage
    localStorage.setItem('user', JSON.stringify(data.data.usuario));
    
    // 4. Redirigir a home
    navigate('/home');
  };
  
  handleCallback();
}, [searchParams, navigate]);
```

**Backend (auth.google.service.js - loginWithGoogle):**
```javascript
const loginWithGoogle = async (code) => {
  // 1. Intercambiar código por tokens con Google
  const { tokens } = await client.getToken({
    code,
    redirect_uri: GOOGLE_REDIRECT_URI,
  });
  
  // 2. Verificar el ID token
  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: GOOGLE_CLIENT_ID,
  });
  
  const payload = ticket.getPayload();
  // payload contiene: sub (ID), email, name, picture
  
  // 3. Buscar usuario en la base de datos
  const usuario = await Usuarios.findOne({
    where: { correo: payload.email },
  });
  
  if (!usuario) {
    throw new Error('Usuario no encontrado');
  }
  
  // 4. Generar JWT
  const token = generateJwtToken(usuario);
  
  // 5. Devolver usuario y token
  return { usuario, token };
};
```

**Backend (auth.google.controller.js):**
```javascript
const loginWithGoogle = async (req, res, next) => {
  const { code } = req.body;
  const { usuario, token } = await authGoogleService.loginWithGoogle(code);
  
  // Establecer cookie con el token
  res.cookie('auth_token', token, {
    httpOnly: true,              // No accesible desde JavaScript
    secure: NODE_ENV === 'production', // Solo HTTPS en producción
    sameSite: 'lax',            // Protección CSRF
    maxAge: 24 * 60 * 60 * 1000 // 1 día
  });
  
  // Devolver respuesta
  res.status(200).json({
    success: true,
    message: 'Inicio de sesión con Google exitoso',
    data: { usuario }
  });
};
```

---

## ⚙️ Configuración del Backend

### Variables de Entorno (.env)

```env
# Puerto del servidor
PORT=3000

# Base de datos
DB_URI=mysql://root:1234@localhost:3306/projectbd
DB_DIALECT=mysql

# JWT
JWT_SECRET=secret

# Google OAuth
GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback
```

### CORS Configurado

**Archivo: src/app.js**
```javascript
app.use(cors({
  origin: 'http://localhost:5173', // Frontend Vite
  credentials: true                // Permitir cookies
}));
```

**¿Por qué es importante?**
- `origin`: Solo permite peticiones desde el frontend
- `credentials: true`: Permite enviar y recibir cookies entre dominios

### Estructura de Rutas

```
/api
  /auth
    /google
      GET  /url       → Obtener URL de Google
      POST /login     → Login con código
      POST /register  → Registro con código
      GET  /callback  → Callback (alternativo)
  /auth
    POST /logout      → Cerrar sesión
```

---

## 🎨 Configuración del Frontend

### Estructura de Archivos

```
src/
├── App.jsx              # Configuración de rutas
├── pages/
│   ├── Login.jsx        # Página de login
│   ├── AuthCallback.jsx # Procesar respuesta de Google
│   └── Home.jsx         # Página principal protegida
```

### Rutas Configuradas

**Archivo: App.jsx**
```javascript
<Router>
  <Routes>
    {/* Ruta por defecto */}
    <Route path="/" element={<Navigate to="/login" replace />} />
    
    {/* Login */}
    <Route path="/login" element={<Login />} />
    
    {/* Callback OAuth */}
    <Route path="/auth/callback" element={<AuthCallback />} />
    
    {/* Página protegida */}
    <Route path="/home" element={<Home />} />
  </Routes>
</Router>
```

---

## 🌐 Consumo de APIs con Fetch

### 1. GET - Obtener URL de Google

**Endpoint:** `GET http://localhost:3000/api/auth/google/url`

**Código Frontend:**
```javascript
const response = await fetch('http://localhost:3000/api/auth/google/url', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
});

const data = await response.json();
```

**Respuesta del Backend:**
```json
{
  "success": true,
  "data": {
    "url": "https://accounts.google.com/o/oauth2/v2/auth?client_id=..."
  }
}
```

**Manejo de Errores:**
```javascript
if (!response.ok) {
  throw new Error('Error al obtener URL de Google');
}
```

---

### 2. POST - Login con Google

**Endpoint:** `POST http://localhost:3000/api/auth/google/login`

**Código Frontend:**
```javascript
const response = await fetch('http://localhost:3000/api/auth/google/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // CRÍTICO: Para recibir cookies
  body: JSON.stringify({ 
    code: 'código-recibido-de-google' 
  }),
});

const data = await response.json();
```

**Body de la Petición:**
```json
{
  "code": "4/0AY0e-g7X..."
}
```

**Respuesta del Backend (Éxito):**
```json
{
  "success": true,
  "message": "Inicio de sesión con Google exitoso",
  "data": {
    "usuario": {
      "id_usuario": 1,
      "nombre_completo": "Juan Pérez",
      "correo": "juan@gmail.com",
      "proveedor_login": "Google",
      "estado": true
    }
  }
}
```

**Headers de Respuesta:**
```
Set-Cookie: auth_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Path=/; Max-Age=86400
```

**Manejo de Errores:**
```javascript
if (response.ok && data.success) {
  // Éxito
  localStorage.setItem('user', JSON.stringify(data.data.usuario));
} else {
  // Error
  throw new Error(data.message || 'Error al autenticar');
}
```

---

### 3. POST - Logout

**Endpoint:** `POST http://localhost:3000/api/auth/logout`

**Código Frontend:**
```javascript
const response = await fetch('http://localhost:3000/api/auth/logout', {
  method: 'POST',
  credentials: 'include', // Enviar cookie de autenticación
});

// Limpiar localStorage
localStorage.removeItem('user');

// Redirigir al login
navigate('/login');
```

**Respuesta del Backend:**
```json
{
  "success": true,
  "message": "Sesión cerrada exitosamente"
}
```

---

## 🔒 Manejo de Sesiones

### Cookies HTTP-Only

El backend establece una cookie segura:

```javascript
res.cookie('auth_token', token, {
  httpOnly: true,    // No accesible desde JavaScript (seguridad)
  secure: false,     // true en producción (requiere HTTPS)
  sameSite: 'lax',   // Protección contra CSRF
  maxAge: 86400000   // 1 día en milisegundos
});
```

### LocalStorage

El frontend guarda información del usuario:

```javascript
// Guardar
localStorage.setItem('user', JSON.stringify({
  id_usuario: 1,
  nombre_completo: "Juan Pérez",
  correo: "juan@gmail.com",
  proveedor_login: "Google",
  estado: true
}));

// Leer
const user = JSON.parse(localStorage.getItem('user'));

// Eliminar
localStorage.removeItem('user');
```

### Verificación de Sesión

**En la página Home:**
```javascript
useEffect(() => {
  const userData = localStorage.getItem('user');
  
  if (!userData) {
    navigate('/login'); // No hay sesión, redirigir
    return;
  }
  
  setUser(JSON.parse(userData));
}, [navigate]);
```

---

## 🛣️ Rutas y Navegación

### Flujo de Navegación

```
1. Usuario accede a "/" 
   → Navigate automático a "/login"

2. Usuario en "/login"
   → Click en botón
   → Redirige a Google
   → Google redirige a "/auth/callback?code=..."

3. "/auth/callback"
   → Procesa código
   → Guarda usuario
   → Navigate a "/home"

4. "/home"
   → Verifica sesión
   → Si no hay sesión → Navigate a "/login"
   → Si hay sesión → Muestra contenido
```

### Redirecciones Programáticas

```javascript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

// Redirigir
navigate('/home');

// Redirigir y reemplazar historial
navigate('/login', { replace: true });
```

---

## 🧪 Testing y Troubleshooting

### Checklist de Configuración

#### Backend
- [ ] Variables de entorno configuradas en `.env`
- [ ] MySQL corriendo en `localhost:3306`
- [ ] Base de datos `projectBD` creada
- [ ] Tablas creadas (usuarios, ordenes, detalle_orden)
- [ ] Backend corriendo en `http://localhost:3000`
- [ ] CORS configurado con origen `http://localhost:5173`

#### Google Cloud Console
- [ ] Proyecto creado
- [ ] APIs habilitadas (Google+ API)
- [ ] Credenciales OAuth 2.0 creadas
- [ ] Origen autorizado: `http://localhost:5173`
- [ ] URI de redirección: `http://localhost:5173/auth/callback`

#### Frontend
- [ ] `react-router-dom` instalado
- [ ] Frontend corriendo en `http://localhost:5173`
- [ ] Todas las páginas creadas (Login, AuthCallback, Home)

### Comandos de Inicio

**Backend:**
```bash
cd BackEnd-nodejs
npm install
npm start
```

**Frontend:**
```bash
cd FrontEnd-ReactVite
npm install
npm run dev
```

### Errores Comunes

#### Error: "CORS policy blocked"

**Causa:** Backend no permite peticiones desde el frontend

**Solución:**
```javascript
// En src/app.js
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

---

#### Error: "Cookie not being set"

**Causa:** Falta `credentials: 'include'` en fetch

**Solución:**
```javascript
fetch('http://localhost:3000/api/auth/google/login', {
  method: 'POST',
  credentials: 'include', // ← AGREGAR ESTO
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ code })
});
```

---

#### Error: "redirect_uri_mismatch"

**Causa:** La URI en Google Console no coincide con la del código

**Verificar:**
1. `.env`: `GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback`
2. Google Console: Agregar exactamente `http://localhost:5173/auth/callback`
3. Sin slash final, con http (no https en desarrollo)

---

#### Error: "Usuario no encontrado"

**Causa:** El email de Google no está en la base de datos

**Solución:** Usar el endpoint de registro primero
```javascript
// Cambiar en AuthCallback.jsx
fetch('http://localhost:3000/api/auth/google/register', { // ← register
  method: 'POST',
  // ...
});
```

O insertar usuario manualmente en MySQL:
```sql
INSERT INTO usuarios (nombre_completo, correo, proveedor_login, id_microsoft)
VALUES ('Test User', 'test@gmail.com', 'Google', 'google-123456');
```

---

## 📊 Diagrama de Datos

### Tabla: usuarios

```sql
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(150) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    proveedor_login VARCHAR(50) NOT NULL DEFAULT 'Microsoft',
    id_microsoft VARCHAR(200) NOT NULL UNIQUE, -- Usado para Google también
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado BOOLEAN DEFAULT TRUE
);
```

**Nota:** `id_microsoft` se usa para cualquier OAuth (Google, Microsoft, etc.)

---

## 🔄 Flujo Completo Resumido

```
1. Frontend → GET /api/auth/google/url
   ← Backend devuelve URL de Google

2. Frontend → window.location = URL de Google
   Usuario autentica en Google

3. Google → Redirige a /auth/callback?code=ABC

4. Frontend → POST /api/auth/google/login {code}
   ← Backend devuelve {usuario} + cookie

5. Frontend → Guarda usuario en localStorage
   → Navigate a /home

6. Página Home → Verifica localStorage
   → Si existe: Muestra datos
   → Si no: Redirige a /login
```

---

## 📝 Notas Finales

### Seguridad

1. **JWT en cookie HttpOnly**: No accesible desde JavaScript, previene XSS
2. **CORS restrictivo**: Solo permite el origen del frontend
3. **SameSite=lax**: Protección contra CSRF
4. **Verificación en cada petición**: Middleware verifica token en rutas protegidas

### Producción

Para desplegar en producción, cambiar:

```env
# Backend .env
NODE_ENV=production
GOOGLE_REDIRECT_URI=https://tu-dominio.com/auth/callback

# Frontend - Cambiar URLs
const API_URL = 'https://api.tu-dominio.com';
```

Y en Google Console:
- Agregar URI de producción
- Verificar dominio

---

## 📚 Referencias

- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [React Router](https://reactrouter.com/)
- [Express CORS](https://expressjs.com/en/resources/middleware/cors.html)

---

**Última actualización:** 20 de enero de 2026
**Versión:** 1.0.0
**Autor:** InnovaTech Elite Team
