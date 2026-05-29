import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🧹 Nettoyage complet de tous les comptes...')

  try {
    // Supprimer d'abord toutes les relations (en cascade manuelle)
    console.log('🗑️  Suppression des avis...')
    await prisma.avis.deleteMany()

    console.log('🗑️  Suppression des paiements...')
    await prisma.paiement.deleteMany()

    console.log('🗑️  Suppression des séances...')
    await prisma.seance.deleteMany()

    console.log('🗑️  Suppression des annonces et relations...')
    await prisma.annonceNiveau.deleteMany()
    await prisma.annonce.deleteMany()

    console.log('🗑️  Suppression des enseignements...')
    await prisma.enseigne.deleteMany()

    console.log('🗑️  Suppression des élèves...')
    await prisma.eleve.deleteMany()

    console.log('🗑️  Suppression des parents...')
    await prisma.parent.deleteMany()

    console.log('🗑️  Suppression des professeurs...')
    await prisma.professeur.deleteMany()

    console.log('🗑️  Suppression des utilisateurs...')
    const deletedUsers = await prisma.utilisateur.deleteMany()

    console.log(`✅ ${deletedUsers.count} utilisateur(s) supprimé(s)`)

    // Vérifier les comptes restants
    const remainingUsers = await prisma.utilisateur.findMany()
    console.log(`📊 Comptes restants dans la base de données : ${remainingUsers.length}`)

    if (remainingUsers.length === 0) {
      console.log('✨ Tous les comptes ont été supprimés avec succès !')
    } else {
      console.log('ℹ️  Comptes restants :', remainingUsers.map(u => u.email))
    }

  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ Erreur critique:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })