# 🚀 InnovaTech Elite - Proceso de Formación

## 📋 Descripción

Proyecto de formación que integra un backend Node.js con frontend React + Vite, implementando autenticación con Google OAuth 2.0.

---

## 🛠️ Tecnologías Utilizadas

### Backend
- Node.js + Express
- MySQL + Sequelize
- Google OAuth 2.0
- JWT para tokens
- Cookie-parser

### Frontend
- React 18
- Vite
- React Router DOM
- Fetch API

---

## 🚦 Pasos para ejecutar el proyecto

### 1️⃣ Configurar Base de Datos

Ejecuta en MySQL:

```sql
CREATE DATABASE IF NOT EXISTS projectBD
CHARACTER SET utf8mb4
COLLATE utf8mb4_spanish_ci;

USE projectBD;

CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(150) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    proveedor_login VARCHAR(50) NOT NULL DEFAULT 'Microsoft', 
    id_microsoft VARCHAR(200) NOT NULL UNIQUE,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado BOOLEAN DEFAULT TRUE
);

CREATE TABLE ordenes (
    id_orden INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    fecha_orden DATETIME DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    CONSTRAINT fk_orden_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE detalle_orden (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_orden INT NOT NULL,
    nombre_juego VARCHAR(100) NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0), 
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_detalle_orden
        FOREIGN KEY (id_orden)
        REFERENCES ordenes(id_orden)
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);
```

### 2️⃣ Configurar Google OAuth

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto nuevo
3. Habilita la API de Google+ 
4. Ve a **"Credenciales"** → **"Crear credenciales"** → **"ID de cliente OAuth 2.0"**
5. Configura la pantalla de consentimiento
6. En las credenciales OAuth, agrega:
   - **Orígenes JavaScript autorizados:**
     - `http://localhost:5173`
     - `http://localhost:3000`
   - **URIs de redirección autorizados:**
     - `http://localhost:5173/auth/callback`
7. Copia el **Client ID** y **Client Secret**

### 3️⃣ Configurar Backend

```bash
cd BackEnd-nodejs
npm install
```

Crea o edita el archivo `.env` con tus credenciales:

```env
NODE_ENV=development
PORT=3000

DB_URI=mysql://root:1234@localhost:3306/projectbd
DB_DIALECT=mysql

JWT_SECRET=secret

GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback
```

Inicia el servidor:

```bash
npm start
```

El backend estará disponible en: `http://localhost:3000`

### 4️⃣ Configurar Frontend

```bash
cd FrontEnd-ReactVite
npm install
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

### 5️⃣ Probar la Aplicación

1. Abre `http://localhost:5173` en tu navegador
2. Haz click en **"Iniciar con Google"**
3. Autoriza con tu cuenta de Google
4. Serás redirigido automáticamente a la página principal

**Nota:** La primera vez, usa el endpoint de **registro** en lugar de login. Puedes cambiar esto temporalmente en `AuthCallback.jsx`:

```javascript
// Cambiar de:
fetch('http://localhost:3000/api/auth/google/login', ...)

// A:
fetch('http://localhost:3000/api/auth/google/register', ...)
```

---

## 📁 Estructura del Proyecto

```
InnovaTechElite-ProcesoFormacion/
│
├── BackEnd-nodejs/
│   ├── src/
│   │   ├── app.js
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── environment.js
│   │   ├── controllers/
│   │   │   └── auth.google.controller.js
│   │   ├── services/
│   │   │   └── auth.google.service.js
│   │   ├── routes/
│   │   │   └── auth/
│   │   │       └── google.routes.js
│   │   ├── models/
│   │   └── middleware/
│   ├── server.js
│   └── .env
│
├── FrontEnd-ReactVite/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── pages/
│   │       ├── Login.jsx
│   │       ├── AuthCallback.jsx
│   │       └── Home.jsx
│   └── package.json
│
├── DOCUMENTACION.md
└── README.md
```

---

## 🔗 Endpoints de la API

### Autenticación con Google

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/auth/google/url` | Obtiene la URL de autorización de Google |
| POST | `/api/auth/google/login` | Inicia sesión con el código de Google |
| POST | `/api/auth/google/register` | Registra nuevo usuario con Google |
| POST | `/api/auth/logout` | Cierra la sesión del usuario |

---

## 🔑 Flujo de Autenticación

```
1. Usuario → Click "Iniciar con Google"
2. Frontend → GET /api/auth/google/url
3. Backend → Devuelve URL de Google
4. Frontend → Redirige a Google
5. Google → Usuario autoriza
6. Google → Redirige a /auth/callback?code=ABC123
7. Frontend → Captura código de la URL
8. Frontend → POST /api/auth/google/login { code }
9. Backend → Verifica código con Google
10. Backend → Crea/obtiene usuario en DB
11. Backend → Devuelve usuario + cookie de sesión
12. Frontend → Guarda usuario y redirige a /home
```

---

## 📚 Documentación Completa

Ver **[DOCUMENTACION.md](./DOCUMENTACION.md)** para información detallada sobre:

- ✅ Flujo completo de autenticación OAuth
- ✅ Consumo de APIs con Fetch (paso a paso)
- ✅ Manejo de sesiones y cookies
- ✅ Configuración de CORS
- ✅ Troubleshooting y errores comunes
- ✅ Diagramas y ejemplos de código

---

## ⚠️ Notas Importantes

1. **Campo `id_microsoft`**: A pesar del nombre, este campo es genérico y funciona para cualquier proveedor OAuth (Google, Microsoft, Facebook, etc.). Es solo el nombre en la base de datos.

2. **Primera vez**: Deberás usar el endpoint `/register` la primera vez para crear el usuario en la base de datos.

3. **MySQL**: Asegúrate de que MySQL esté corriendo antes de iniciar el backend.

4. **Credenciales**: Nunca compartas tu `.env` o subas las credenciales de Google a GitHub.

---

## 🐛 Troubleshooting

### Error: CORS policy blocked
- Verifica que en `src/app.js` el origen sea `http://localhost:5173`
- Asegúrate de tener `credentials: true` en el CORS

### Error: redirect_uri_mismatch
- Verifica que en `.env` tengas: `GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback`
- En Google Console, agrega exactamente: `http://localhost:5173/auth/callback`

### Error: Usuario no encontrado
- Usa el endpoint `/register` la primera vez
- O inserta un usuario manualmente en MySQL

### Error: Cookie no se establece
- Agrega `credentials: 'include'` en todas las peticiones fetch
- Verifica la configuración de CORS en el backend

---

## 📞 Soporte

Para más ayuda, consulta la **[DOCUMENTACION.md](./DOCUMENTACION.md)** completa.

---

**Versión:** 1.0.0  
**Última actualización:** 20 de enero de 2026
