import { PrismaClient, Platform } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Seed Community Academy (WEOKTO Guild)
  const communityAcademy = await prisma.community.upsert({
    where: { slug: 'community-academy' },
    update: {},
    create: {
      platform: Platform.WEOKTO,
      name: 'Community Academy',
      slug: 'community-academy',
      isActive: true,
      ownerNotes: 'Guilde principale WEOKTO pour formation communautés',
    },
  })

  console.log('✅ Created/Updated Community Academy:', communityAcademy.name)

  // Seed TBCB (The Best Community Builder)
  const tbcb = await prisma.community.upsert({
    where: { slug: 'tbcb' },
    update: {},
    create: {
      platform: Platform.WEOKTO,
      name: 'The Best Community Builder',
      slug: 'tbcb',
      isActive: true,
      ownerNotes: 'Guilde TBCB - Formation constructeurs de communautés',
    },
  })

  console.log('✅ Created/Updated TBCB:', tbcb.name)

  console.log('🎉 Seed completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
