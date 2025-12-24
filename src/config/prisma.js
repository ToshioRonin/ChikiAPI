// Importas desde la carpeta que definiste en el schema
const { PrismaClient } = require('../../generated/prisma');

const prisma = new PrismaClient();

module.exports = prisma;