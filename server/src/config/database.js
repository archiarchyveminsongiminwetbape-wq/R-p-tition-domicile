const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Tester la connexion
prisma.$connect()
  .then(() => {
    console.log('✅ Connexion à la base de données Prisma PostgreSQL réussie');
  })
  .catch(err => {
    console.error('❌ Erreur de connexion à la base de données:', err.message);
  });

module.exports = prisma;