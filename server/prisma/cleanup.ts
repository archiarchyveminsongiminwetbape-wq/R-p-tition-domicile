import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupDatabase() {
  console.log('🧹 Nettoyage de la base de données...');

  try {
    // Supprimer toutes les séances
    const seancesCount = await prisma.seance.deleteMany({});
    console.log(`✅ ${seancesCount.count} séances supprimées`);

    // Supprimer toutes les annonces
    const annoncesCount = await prisma.annonce.deleteMany({});
    console.log(`✅ ${annoncesCount.count} annonces supprimées`);

    // Supprimer tous les élèves
    const elevesCount = await prisma.eleve.deleteMany({});
    console.log(`✅ ${elevesCount.count} élèves supprimés`);

    // Supprimer tous les professeurs
    const professeursCount = await prisma.professeur.deleteMany({});
    console.log(`✅ ${professeursCount.count} professeurs supprimés`);

    // Supprimer tous les utilisateurs
    const usersCount = await prisma.user.deleteMany({});
    console.log(`✅ ${usersCount.count} utilisateurs supprimés`);

    console.log('🎉 Base de données nettoyée avec succès !');
    console.log('📊 Toutes les tables sont maintenant vides.');
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupDatabase();