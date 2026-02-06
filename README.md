# ChikiAPI

API RESTful para gestión de cartas rúnicas, eventos y usuarios con autenticación JWT.

## Tecnologías

- Node.js + Express
- Prisma ORM
- Supabase (PostgreSQL)
- JWT Authentication
- Docker

## Configuración Inicial

### 1. Variables de Entorno

El proyecto ya incluye un archivo `.env` configurado. Las variables importantes son:

```env
DATABASE_URL=postgresql://postgres:postgres@0ec90b57d6e95fcbda19832f.supabase.co:5432/postgres
JWT_SECRET=chiki_secret_key_super_secure_2024_change_in_production
JWT_REFRESH_SECRET=chiki_refresh_secret_key_super_secure_2024_change_in_production
```

### 2. Instalación de Dependencias

```bash
npm install
```

### 3. Generar Cliente de Prisma

```bash
npm run prisma:generate
```

### 4. Ejecutar Migraciones en Supabase

```bash
npm run prisma:migrate:deploy
```

## Desarrollo Local

### Sin Docker

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3001`

### Con Docker

```bash
# Construir imagen
npm run docker:build

# Iniciar contenedor
npm run docker:up

# Ver logs
npm run docker:logs

# Detener contenedor
npm run docker:down
```

## Documentación API

Accede a Swagger UI en: `http://localhost:3001/api-docs`

## Estructura del Proyecto

```
src/
├── config/         # Configuraciones (Prisma, Swagger)
├── controllers/    # Controladores de rutas
├── middlewares/    # Middlewares (Auth)
├── routes/         # Definición de rutas
├── app.js          # Configuración de Express
└── server.js       # Punto de entrada

prisma/
└── schema.prisma   # Esquema de base de datos
```

## Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/refresh` - Renovar token
- `POST /api/auth/logout` - Cerrar sesión

### Cartas
- `GET /api/cards` - Listar cartas activas
- `GET /api/cards/:id` - Obtener carta por ID
- `GET /api/cards/trash` - Ver cartas en papelera (Admin)
- `POST /api/cards` - Crear carta (Admin)
- `PUT /api/cards/:id` - Actualizar carta (Admin)
- `DELETE /api/cards/:id` - Eliminar carta lógicamente (Admin)
- `DELETE /api/cards/:id/permanent` - Eliminar definitivamente (Admin)
- `PATCH /api/cards/:id/restore` - Restaurar carta (Admin)

### Eventos
- `GET /api/events` - Listar eventos
- `POST /api/events` - Crear evento (Admin)
- `PUT /api/events/:id` - Actualizar evento (Admin)
- `DELETE /api/events/:id` - Eliminar evento (Admin)
- `POST /api/events/:id/join` - Inscribirse en evento
- `PATCH /api/events/:id/status` - Cambiar estado manualmente (Admin)

## Scripts Disponibles

- `npm run dev` - Desarrollo con nodemon
- `npm start` - Producción
- `npm run prisma:generate` - Generar cliente Prisma
- `npm run prisma:migrate:dev` - Ejecutar migraciones (dev)
- `npm run prisma:migrate:deploy` - Ejecutar migraciones (prod)
- `npm run prisma:studio` - Abrir Prisma Studio
- `npm run docker:build` - Construir imagen Docker
- `npm run docker:up` - Iniciar contenedor
- `npm run docker:down` - Detener contenedor
- `npm run docker:logs` - Ver logs del contenedor

## Seguridad

- Las contraseñas se hashean con bcrypt
- Autenticación basada en JWT con tokens de acceso y refresco
- Tokens de refresco almacenados en cookies HTTPOnly
- Middleware de autenticación para rutas protegidas
- Roles de usuario (USER, ADMIN)

## Correcciones Realizadas

### Problemas Resueltos

1. **Base de datos migrada a Supabase**: Se eliminó PostgreSQL local y se configuró la conexión a Supabase
2. **Variables de entorno**: Se agregaron todas las variables necesarias (JWT_SECRET, DATABASE_URL, etc)
3. **Docker simplificado**: Se eliminó el servicio de base de datos local del docker-compose
4. **Dockerfile optimizado**: Usa `npm ci` para instalaciones reproducibles
5. **Scripts actualizados**: Nuevos scripts para facilitar el desarrollo y deployment
6. **Archivos adicionales**:
   - `.env.example` para documentación
   - `.dockerignore` para optimizar builds
   - `uploads/.gitkeep` para mantener la carpeta en git

## Notas Importantes

- El proyecto usa Supabase como base de datos (NO PostgreSQL local)
- Los tokens de acceso expiran en 15 minutos
- Los tokens de refresco expiran en 7 días
- Las cartas eliminadas se mueven a una "papelera" (soft delete)
- Los eventos no pueden editarse/eliminarse si ya tienen participantes inscritos

## Inicio Rápido

```bash
# Instalar dependencias
npm install

# Generar cliente Prisma
npm run prisma:generate

# Ejecutar migraciones en Supabase
npm run prisma:migrate:deploy

# Iniciar en desarrollo
npm run dev
```

O con Docker:

```bash
npm run docker:build
npm run docker:up
npm run docker:logs
```
