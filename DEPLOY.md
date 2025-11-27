# CARSON - Sistema de Gestión de Inventario de Carros

## 🚀 Despliegue en Render

Este proyecto está configurado para desplegarse en Render con un backend Node.js/Express y un frontend estático.

### 📋 Requisitos Previos

1. Cuenta en [Render](https://render.com)
2. Cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (para base de datos)
3. Repositorio Git conectado a Render

---

## 🔧 Configuración del Backend (API)

### Opción 1: Usando render.yaml (Recomendado)

1. **Conecta tu repositorio** a Render
2. Render detectará automáticamente el archivo `render.yaml` en la raíz
3. **Configura las variables de entorno** en el dashboard de Render:
   - `MONGODB_URI`: Tu string de conexión de MongoDB Atlas
   - `PORT`: 5000 (ya configurado)
   - `NODE_ENV`: production (ya configurado)

### Opción 2: Configuración Manual

1. **Crear nuevo Web Service** en Render:
   - **Name**: carson-backend
   - **Region**: Oregon (o la más cercana)
   - **Branch**: main
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

2. **Variables de Entorno**:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/carson
   ```

3. **Health Check Path**: `/api/health`

---

## 🌐 Configuración del Frontend

### Opción 1: Usando render.yaml

El archivo `render.yaml` ya configura el frontend como sitio estático.

### Opción 2: Configuración Manual

1. **Crear nuevo Static Site** en Render:
   - **Name**: carson-frontend
   - **Region**: Oregon
   - **Branch**: main
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npx tailwindcss -i styles.css -o dist/styles.css --minify`
   - **Publish Directory**: `.` (directorio actual de frontend)

2. **Actualizar script.js** con la URL del backend:
   ```javascript
   const API_URL = 'https://carson-backend.onrender.com';
   ```

---

## 📝 Configuración de MongoDB Atlas

1. Crea un cluster gratuito en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. En **Database Access**, crea un usuario con permisos de lectura/escritura
3. En **Network Access**, agrega `0.0.0.0/0` para permitir conexiones desde Render
4. Obtén tu **Connection String** y úsalo como `MONGODB_URI`

---

## 🔄 Comandos Importantes

### Backend
```bash
# Desarrollo local
npm run dev

# Compilar TypeScript
npm run build

# Iniciar en producción
npm start

# Ejecutar seed de datos
npm run seed
```

### Frontend
```bash
# Compilar Tailwind CSS
npx tailwindcss -i styles.css -o dist/styles.css --minify
```

---

## 📂 Estructura del Proyecto

```
carson/
├── backend/
│   ├── src/
│   │   ├── index.ts          # Servidor principal
│   │   ├── controllers/
│   │   ├── models/
│   │   └── routes/
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/
│   ├── index.html
│   ├── script.js
│   ├── styles.css
│   └── package.json
└── render.yaml               # Configuración de Render
```

---

## 🔐 Variables de Entorno

Copia `.env.example` a `.env` en el directorio `backend` para desarrollo local:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/carson
NODE_ENV=development
```

**En Render**, configura estas variables en el Dashboard:
- `MONGODB_URI`: Tu string de conexión de MongoDB Atlas
- `PORT`: 5000
- `NODE_ENV`: production

---

## 🚦 Endpoints de la API

- **GET** `/` - Información de la API
- **GET** `/api/health` - Health check
- **GET** `/api/carros` - Listar todos los carros
- **POST** `/api/carros` - Crear un nuevo carro
- **GET** `/api/carros/:id` - Obtener un carro por ID
- **PUT** `/api/carros/:id` - Actualizar un carro
- **DELETE** `/api/carros/:id` - Eliminar un carro
- **GET** `/api/carros/estadisticas` - Estadísticas del inventario

---

## 🐛 Troubleshooting

### El backend no se conecta a MongoDB
- Verifica que `MONGODB_URI` esté correctamente configurado
- Asegúrate de que la IP `0.0.0.0/0` esté en Network Access de MongoDB Atlas
- Revisa los logs en el dashboard de Render

### El frontend no se comunica con el backend
- Actualiza la variable `API_URL` en `script.js` con la URL de tu backend en Render
- Verifica que CORS esté habilitado en el backend

### Error de build en TypeScript
- Asegúrate de que todas las dependencias estén en `dependencies` (no solo en `devDependencies`)
- Verifica que `typescript` y `ts-node` estén instalados

---

## 📞 Soporte

Para más información sobre Render:
- [Documentación de Render](https://render.com/docs)
- [Render para Node.js](https://render.com/docs/deploy-node-express-app)

---

## ✅ Checklist de Despliegue

- [ ] Crear cluster en MongoDB Atlas
- [ ] Configurar Network Access (0.0.0.0/0)
- [ ] Obtener string de conexión de MongoDB
- [ ] Conectar repositorio Git a Render
- [ ] Configurar variables de entorno en Render
- [ ] Desplegar backend (Web Service)
- [ ] Actualizar API_URL en frontend
- [ ] Desplegar frontend (Static Site)
- [ ] Probar endpoints de la API
- [ ] Verificar que el frontend se conecte al backend

¡Listo! 🎉
