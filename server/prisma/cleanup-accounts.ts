import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🧹 Nettoyage des comptes de test...')

  // Emails des comptes de test à supprimer
  const testEmails = [
    'test@example.com',
    'parent.nouveau@example.com',
    'archiarchyveminsongiminwetbape@gmail.com'
  ]

  for (const email of testEmails) {
    try {
      // Trouver l'utilisateur
      const utilisateur = await prisma.utilisateur.findUnique({
        where: { email }
      })

      if (!utilisateur) {
        console.log(`ℹ️  Compte ${email} non trouvé`)
        continue
      }

      // Supprimer le profil parent si existe
      if (utilisateur.role === 'parent') {
        const parent = await prisma.parent.findUnique({
          where: { utilisateurId: utilisateur.id }
        })

        if (parent) {
          // Supprimer les élèves du parent
          await prisma.eleve.deleteMany({
            where: { parentId: parent.id }
          })

          // Supprimer le profil parent
          await prisma.parent.delete({
            where: { id: parent.id }
          })
          console.log(`✅ Profil parent supprimé pour ${email}`)
        }
      }

      // Supprimer le profil professeur si existe
      if (utilisateur.role === 'professeur') {
        const professeur = await prisma.professeur.findUnique({
          where: { utilisateurId: utilisateur.id }
        })

        if (professeur) {
          // Supprimer les annonces du professeur
          await prisma.annonce.deleteMany({
            where: { professeurId: professeur.id }
          })

          // Supprimer les matières enseignées
          await prisma.enseigne.deleteMany({
            where: { professeurId: professeur.id }
          })

          // Supprimer le profil professeur
          await prisma.professeur.delete({
            where: { id: professeur.id }
          })
          console.log(`✅ Profil professeur supprimé pour ${email}`)
        }
      }

      // Supprimer l'utilisateur
      await prisma.utilisateur.delete({
        where: { id: utilisateur.id }
      })
      console.log(`✅ Compte utilisateur supprimé : ${email}`)

    } catch (error) {
      console.error(`❌ Erreur lors de la suppression de ${email}:`, error)
    }
  }

  // Vérifier les comptes restants
  const remainingUsers = await prisma.utilisateur.findMany()
  console.log(`📊 Comptes restants dans la base de données : ${remainingUsers.length}`)

  if (remainingUsers.length === 0) {
    console.log('✨ Tous les comptes de test ont été supprimés avec succès !')
  } else {
    console.log('ℹ️  Comptes restants :', remainingUsers.map(u => u.email))
  }
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du nettoyage:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })