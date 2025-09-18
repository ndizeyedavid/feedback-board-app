const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Create sample users
  const user1 = await prisma.user.upsert({
    where: { username: 'GTAFan2024' },
    update: {},
    create: {
      username: 'GTAFan2024',
      email: 'gtafan@example.com'
    }
  })

  const user2 = await prisma.user.upsert({
    where: { username: 'ViceCityLover' },
    update: {},
    create: {
      username: 'ViceCityLover',
      email: 'vicecity@example.com'
    }
  })

  const user3 = await prisma.user.upsert({
    where: { username: 'RockstarDev' },
    update: {},
    create: {
      username: 'RockstarDev',
      email: 'dev@rockstar.com'
    }
  })

  // Create sample feedback
  const feedback1 = await prisma.feedback.create({
    data: {
      title: 'Improved Vehicle Physics System',
      description: 'The driving mechanics should feel more realistic with better weight distribution and handling for different vehicle types. Sports cars should handle differently from trucks.',
      category: 'GAMEPLAY',
      authorId: user1.id,
      upvoteCount: 47
    }
  })

  const feedback2 = await prisma.feedback.create({
    data: {
      title: 'Enhanced Character Customization',
      description: 'More detailed character creation options including facial features, body types, clothing styles, and tattoos. Should rival other open-world games.',
      category: 'GRAPHICS',
      authorId: user2.id,
      upvoteCount: 89
    }
  })

  const feedback3 = await prisma.feedback.create({
    data: {
      title: 'Dynamic Weather and Day/Night Cycle',
      description: 'Weather should affect gameplay - rain makes driving harder, fog reduces visibility. Day/night cycle should impact NPC behavior and mission availability.',
      category: 'WORLD',
      authorId: user1.id,
      upvoteCount: 156
    }
  })

  const feedback4 = await prisma.feedback.create({
    data: {
      title: 'Branching Storyline Paths',
      description: 'Multiple story paths based on player choices. Different endings and character relationships depending on moral decisions throughout the game.',
      category: 'STORY',
      authorId: user2.id,
      upvoteCount: 203
    }
  })

  // Create sample comments
  await prisma.comment.createMany({
    data: [
      {
        content: 'Absolutely agree! The vehicle physics in GTA V felt too arcade-like.',
        authorId: user2.id,
        feedbackId: feedback1.id
      },
      {
        content: 'We\'re definitely looking into more realistic driving mechanics for VI.',
        authorId: user3.id,
        feedbackId: feedback1.id
      },
      {
        content: 'This would make the game so much more immersive!',
        authorId: user1.id,
        feedbackId: feedback2.id
      },
      {
        content: 'Weather effects on gameplay would be amazing. Hope they implement this!',
        authorId: user3.id,
        feedbackId: feedback3.id
      },
      {
        content: 'Multiple story paths would give the game huge replay value.',
        authorId: user1.id,
        feedbackId: feedback4.id
      }
    ]
  })

  // Create sample upvotes
  await prisma.upvote.createMany({
    data: [
      { userId: user1.id, feedbackId: feedback2.id },
      { userId: user1.id, feedbackId: feedback4.id },
      { userId: user2.id, feedbackId: feedback1.id },
      { userId: user2.id, feedbackId: feedback3.id },
      { userId: user3.id, feedbackId: feedback3.id },
      { userId: user3.id, feedbackId: feedback4.id }
    ]
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
