#!/bin/bash

echo "==================================="
echo "   ChikiAPI - Inicio del Servidor"
echo "==================================="
echo ""

# Verificar si existe el archivo .env
if [ ! -f .env ]; then
    echo "ERROR: No se encontró el archivo .env"
    echo "Por favor, copia .env.example a .env y configura tus credenciales"
    exit 1
fi

# Verificar si DATABASE_URL está configurado
if grep -q "YOUR_PASSWORD" .env || grep -q "YOUR_PROJECT" .env; then
    echo "ADVERTENCIA: DATABASE_URL no está configurado correctamente"
    echo ""
    echo "Por favor, sigue estos pasos:"
    echo "1. Lee el archivo SETUP.md para instrucciones detalladas"
    echo "2. Crea un proyecto en Supabase: https://supabase.com"
    echo "3. Obtén tu cadena de conexión desde Settings > Database"
    echo "4. Actualiza el DATABASE_URL en tu archivo .env"
    echo ""
    read -p "¿Deseas continuar de todos modos? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "Instalando dependencias..."
npm install

echo ""
echo "Generando cliente Prisma..."
npm run prisma:generate

echo ""
echo "Intentando aplicar migraciones..."
npm run prisma:migrate:deploy

if [ $? -eq 0 ]; then
    echo ""
    echo "Base de datos configurada correctamente"
    echo ""
    echo "Iniciando servidor en modo desarrollo..."
    npm run dev
else
    echo ""
    echo "ERROR: No se pudieron aplicar las migraciones"
    echo "Por favor, verifica tu DATABASE_URL en el archivo .env"
    echo "Consulta SETUP.md para más información"
    exit 1
fi
