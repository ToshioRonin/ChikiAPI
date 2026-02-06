# Guía de Configuración de Supabase

## Paso 1: Crear Proyecto en Supabase

1. Ve a https://supabase.com
2. Crea una cuenta o inicia sesión
3. Haz clic en "New Project"
4. Completa:
   - **Name**: ChikiAPI
   - **Database Password**: Guarda esta contraseña
   - **Region**: Elige la más cercana
   - **Pricing Plan**: Free tier está bien

## Paso 2: Obtener Cadena de Conexión

### Opción A: Connection Pooling (Recomendado)

1. En tu proyecto de Supabase, ve a **Settings** > **Database**
2. Busca la sección **Connection Pooling**
3. Selecciona **Transaction mode**
4. Copia la URI que aparece, se verá así:
   ```
   postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

### Opción B: Direct Connection

1. En **Settings** > **Database**
2. Busca la sección **Connection string**
3. Selecciona **URI**
4. Copia la cadena, se verá así:
   ```
   postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
   ```

## Paso 3: Actualizar .env

Reemplaza la línea DATABASE_URL en tu archivo `.env`:

```env
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

**IMPORTANTE**: Reemplaza:
- `[PROJECT-REF]` con tu referencia de proyecto
- `[PASSWORD]` con la contraseña de tu base de datos
- `[REGION]` con la región de tu proyecto

## Paso 4: Ejecutar Migraciones

Una vez configurado el DATABASE_URL correcto:

```bash
# Generar cliente Prisma
npm run prisma:generate

# Aplicar migraciones
npm run prisma:migrate:deploy

# Iniciar servidor
npm run dev
```

## Paso 5: Verificar Conexión

Puedes verificar la conexión a la base de datos con:

```bash
npx prisma studio
```

Esto abrirá una interfaz web para explorar tu base de datos.

## Troubleshooting

### Error: Can't reach database server

**Solución**: Verifica que:
1. La contraseña en DATABASE_URL sea correcta
2. El PROJECT-REF sea correcto
3. Tu IP esté permitida en Supabase (por defecto permite todas)

### Error: Authentication failed

**Solución**:
1. Ve a **Settings** > **Database** en Supabase
2. Resetea la contraseña de la base de datos
3. Actualiza el DATABASE_URL con la nueva contraseña

### Error: SSL required

**Solución**: Agrega `?sslmode=require` al final de tu DATABASE_URL:
```
DATABASE_URL=postgresql://...?pgbouncer=true&connection_limit=1&sslmode=require
```

## URLs de Ejemplo

### Con Connection Pooling (Puerto 6543):
```
postgresql://postgres.xxxxxxxxxxxx:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### Con Direct Connection (Puerto 5432):
```
postgresql://postgres.xxxxxxxxxxxx:password@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

## Notas Importantes

- **Connection Pooling (Puerto 6543)** es recomendado para aplicaciones serverless o con múltiples conexiones
- **Direct Connection (Puerto 5432)** es mejor para migraciones de Prisma
- Si tienes problemas con las migraciones, intenta usar Direct Connection temporalmente
- Las credenciales ANON_KEY son para el frontend, el DATABASE_URL es para el backend
