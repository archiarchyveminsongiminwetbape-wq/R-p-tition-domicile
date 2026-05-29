import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Début du seeding...')

  // Créer les matières
  const matieres = await Promise.all([
    prisma.matiere.create({
      data: {
        nom: 'Mathématiques',
        description: 'Algèbre, géométrie, analyse, statistiques'
      }
    }),
    prisma.matiere.create({
      data: {
        nom: 'Physique-Chimie',
        description: 'Mécanique, électricité, chimie organique'
      }
    }),
    prisma.matiere.create({
      data: {
        nom: 'Français',
        description: 'Grammaire, littérature, expression écrite'
      }
    }),
    prisma.matiere.create({
      data: {
        nom: 'Anglais',
        description: 'Grammaire, vocabulaire, compréhension orale'
      }
    }),
    prisma.matiere.create({
      data: {
        nom: 'Histoire-Géographie',
        description: 'Histoire, géographie, éducation civique'
      }
    }),
    prisma.matiere.create({
      data: {
        nom: 'SVT',
        description: 'Biologie, géologie, santé'
      }
    }),
    prisma.matiere.create({
      data: {
        nom: 'Informatique',
        description: 'Programmation, bureautique, internet'
      }
    }),
    prisma.matiere.create({
      data: {
        nom: 'Philosophie',
        description: 'Philosophie, citoyenneté, éthique'
      }
    })
  ])

  console.log(`✅ ${matieres.length} matières créées`)

  // Créer les niveaux
  const niveaux = await Promise.all([
    prisma.niveau.create({
      data: {
        nom: 'CP',
        description: 'Cours Préparatoire - 1ère année primaire'
      }
    }),
    prisma.niveau.create({
      data: {
        nom: 'CE1',
        description: 'Cours Élémentaire 1ère année - 2ème année primaire'
      }
    }),
    prisma.niveau.create({
      data: {
        nom: 'CE2',
        description: 'Cours Élémentaire 2ème année - 3ème année primaire'
      }
    }),
    prisma.niveau.create({
      data: {
        nom: 'CM1',
        description: 'Cours Moyen 1ère année - 4ème année primaire'
      }
    }),
    prisma.niveau.create({
      data: {
        nom: 'CM2',
        description: 'Cours Moyen 2ème année - 5ème année primaire'
      }
    }),
    prisma.niveau.create({
      data: {
        nom: '6ème',
        description: '6ème - 1ère année collège'
      }
    }),
    prisma.niveau.create({
      data: {
        nom: '5ème',
        description: '5ème - 2ème année collège'
      }
    }),
    prisma.niveau.create({
      data: {
        nom: '4ème',
        description: '4ème - 3ème année collège'
      }
    }),
    prisma.niveau.create({
      data: {
        nom: '3ème',
        description: '3ème - 4ème année collège'
      }
    }),
    prisma.niveau.create({
      data: {
        nom: 'Seconde',
        description: 'Seconde - 1ère année lycée'
      }
    }),
    prisma.niveau.create({
      data: {
        nom: 'Première',
        description: 'Première - 2ème année lycée'
      }
    }),
    prisma.niveau.create({
      data: {
        nom: 'Terminale',
        description: 'Terminale - 3ème année lycée'
      }
    }),
    prisma.niveau.create({
      data: {
        nom: 'Université',
        description: 'Niveau universitaire'
      }
    })
  ])

  console.log(`✅ ${niveaux.length} niveaux créés`)

  console.log('🎉 Seeding terminé avec succès!')
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })