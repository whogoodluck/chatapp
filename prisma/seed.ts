import { MessageType, PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Clear existing data
  console.log('🧹 Cleaning existing data...')
  await prisma.message.deleteMany()
  await prisma.conversationParticipant.deleteMany()
  await prisma.conversation.deleteMany()
  await prisma.user.deleteMany()

  // Hash password for all users
  const hashedPassword = await bcrypt.hash('password123', 10)

  // Create users
  console.log('👥 Creating users...')
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'john.doe@example.com',
        username: 'john_doe',
        fullName: 'John Doe',
        password: hashedPassword,
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        isOnline: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'sarah.wilson@example.com',
        username: 'sarah_wilson',
        fullName: 'Sarah Wilson',
        password: hashedPassword,
        avatar:
          'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        isOnline: false,
      },
    }),
    prisma.user.create({
      data: {
        email: 'mike.chen@example.com',
        username: 'mike_chen',
        fullName: 'Mike Chen',
        password: hashedPassword,
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        isOnline: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'emma.davis@example.com',
        username: 'emma_davis',
        fullName: 'Emma Davis',
        password: hashedPassword,
        avatar:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        isOnline: false,
      },
    }),
    prisma.user.create({
      data: {
        email: 'alex.brown@example.com',
        username: 'alex_brown',
        fullName: 'Alex Brown',
        password: hashedPassword,
        avatar:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        isOnline: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'lisa.kim@example.com',
        username: 'lisa_kim',
        fullName: 'Lisa Kim',
        password: hashedPassword,
        avatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
        isOnline: false,
      },
    }),
    prisma.user.create({
      data: {
        email: 'david.taylor@example.com',
        username: 'david_taylor',
        fullName: 'David Taylor',
        password: hashedPassword,
        avatar:
          'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop&crop=face',
        isOnline: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'amy.johnson@example.com',
        username: 'amy_johnson',
        fullName: 'Amy Johnson',
        password: hashedPassword,
        avatar:
          'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face',
        isOnline: false,
      },
    }),
  ])

  console.log(`✅ Created ${users.length} users`)

  // Create direct message conversations
  console.log('💬 Creating direct message conversations...')

  // John & Sarah DM
  const dmConversation1 = await prisma.conversation.create({
    data: {
      isGroup: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    },
  })

  await Promise.all([
    prisma.conversationParticipant.create({
      data: {
        userId: users[0].id, // John
        conversationId: dmConversation1.id,
        joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        lastReadAt: new Date(Date.now() - 1000 * 60 * 30),
      },
    }),
    prisma.conversationParticipant.create({
      data: {
        userId: users[1].id, // Sarah
        conversationId: dmConversation1.id,
        joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        lastReadAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      },
    }),
  ])

  // Mike & Emma DM
  const dmConversation2 = await prisma.conversation.create({
    data: {
      isGroup: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    },
  })

  await Promise.all([
    prisma.conversationParticipant.create({
      data: {
        userId: users[2].id, // Mike
        conversationId: dmConversation2.id,
        joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        lastReadAt: new Date(Date.now() - 1000 * 60 * 15),
      },
    }),
    prisma.conversationParticipant.create({
      data: {
        userId: users[3].id, // Emma
        conversationId: dmConversation2.id,
        joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        lastReadAt: new Date(Date.now() - 1000 * 60 * 20),
      },
    }),
  ])

  // Create group conversations
  console.log('👥 Creating group conversations...')

  // Team Discussion Group
  const groupConversation1 = await prisma.conversation.create({
    data: {
      name: 'Team Discussion',
      isGroup: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 1 week ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    },
  })

  await Promise.all([
    prisma.conversationParticipant.create({
      data: {
        userId: users[0].id, // John
        conversationId: groupConversation1.id,
        joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
        lastReadAt: new Date(Date.now() - 1000 * 60 * 60),
      },
    }),
    prisma.conversationParticipant.create({
      data: {
        userId: users[1].id, // Sarah
        conversationId: groupConversation1.id,
        joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
        lastReadAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      },
    }),
    prisma.conversationParticipant.create({
      data: {
        userId: users[2].id, // Mike
        conversationId: groupConversation1.id,
        joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
        lastReadAt: new Date(Date.now() - 1000 * 60 * 30),
      },
    }),
    prisma.conversationParticipant.create({
      data: {
        userId: users[6].id, // David
        conversationId: groupConversation1.id,
        joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
        lastReadAt: new Date(Date.now() - 1000 * 60 * 60),
      },
    }),
  ])

  // Weekend Plans Group
  const groupConversation2 = await prisma.conversation.create({
    data: {
      name: 'Weekend Plans',
      isGroup: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
    },
  })

  await Promise.all([
    prisma.conversationParticipant.create({
      data: {
        userId: users[4].id, // Alex
        conversationId: groupConversation2.id,
        joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        lastReadAt: new Date(Date.now() - 1000 * 60 * 10),
      },
    }),
    prisma.conversationParticipant.create({
      data: {
        userId: users[5].id, // Lisa
        conversationId: groupConversation2.id,
        joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        lastReadAt: new Date(Date.now() - 1000 * 60 * 60),
      },
    }),
    prisma.conversationParticipant.create({
      data: {
        userId: users[7].id, // Amy
        conversationId: groupConversation2.id,
        joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        lastReadAt: new Date(Date.now() - 1000 * 60 * 15),
      },
    }),
  ])

  // Create messages
  console.log('📝 Creating messages...')

  // Messages for John & Sarah DM
  await Promise.all([
    prisma.message.create({
      data: {
        content: "Hey Sarah! How's the project coming along?",
        messageType: MessageType.TEXT,
        senderId: users[0].id, // John
        conversationId: dmConversation1.id,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      },
    }),
    prisma.message.create({
      data: {
        content: 'Going well! Just finished the design mockups. Want to take a look?',
        messageType: MessageType.TEXT,
        senderId: users[1].id, // Sarah
        conversationId: dmConversation1.id,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1.5), // 1.5 hours ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
      },
    }),
    prisma.message.create({
      data: {
        content: 'Absolutely! Can you share them in our team channel?',
        messageType: MessageType.TEXT,
        senderId: users[0].id, // John
        conversationId: dmConversation1.id,
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 30),
      },
    }),
  ])

  // Messages for Mike & Emma DM
  await Promise.all([
    prisma.message.create({
      data: {
        content: 'Did you see the latest updates on the presentation?',
        messageType: MessageType.TEXT,
        senderId: users[2].id, // Mike
        conversationId: dmConversation2.id,
        createdAt: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 45),
      },
    }),
    prisma.message.create({
      data: {
        content: 'Yes! The new slides look great. Thanks for your help with the research.',
        messageType: MessageType.TEXT,
        senderId: users[3].id, // Emma
        conversationId: dmConversation2.id,
        createdAt: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 20),
      },
    }),
    prisma.message.create({
      data: {
        content: 'No problem! We make a great team 💪',
        messageType: MessageType.TEXT,
        senderId: users[2].id, // Mike
        conversationId: dmConversation2.id,
        createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 15),
      },
    }),
  ])

  // Messages for Team Discussion Group
  await Promise.all([
    prisma.message.create({
      data: {
        content: "Good morning everyone! Let's sync up on today's priorities.",
        messageType: MessageType.TEXT,
        senderId: users[0].id, // John
        conversationId: groupConversation1.id,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
      },
    }),
    prisma.message.create({
      data: {
        content: "Morning! I'll be working on the user interface components today.",
        messageType: MessageType.TEXT,
        senderId: users[1].id, // Sarah
        conversationId: groupConversation1.id,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2.5), // 2.5 hours ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2.5),
      },
    }),
    prisma.message.create({
      data: {
        content: "Perfect! I'll focus on the backend API integration.",
        messageType: MessageType.TEXT,
        senderId: users[2].id, // Mike
        conversationId: groupConversation1.id,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      },
    }),
    prisma.message.create({
      data: {
        content: "I'll handle the database optimizations and testing.",
        messageType: MessageType.TEXT,
        senderId: users[6].id, // David
        conversationId: groupConversation1.id,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1.5), // 1.5 hours ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
      },
    }),
    prisma.message.create({
      data: {
        content: "Great plan! Let's reconvene at 3 PM to share progress.",
        messageType: MessageType.TEXT,
        senderId: users[0].id, // John
        conversationId: groupConversation1.id,
        createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 60),
      },
    }),
  ])

  // Messages for Weekend Plans Group
  await Promise.all([
    prisma.message.create({
      data: {
        content: "Who's up for hiking this Saturday? 🥾",
        messageType: MessageType.TEXT,
        senderId: users[4].id, // Alex
        conversationId: groupConversation2.id,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
      },
    }),
    prisma.message.create({
      data: {
        content: "I'm in! What trail are you thinking?",
        messageType: MessageType.TEXT,
        senderId: users[5].id, // Lisa
        conversationId: groupConversation2.id,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
      },
    }),
    prisma.message.create({
      data: {
        content: 'Count me in too! Maybe the Blue Ridge Trail?',
        messageType: MessageType.TEXT,
        senderId: users[7].id, // Amy
        conversationId: groupConversation2.id,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
      },
    }),
    prisma.message.create({
      data: {
        content: "Blue Ridge sounds perfect! Let's meet at 8 AM at the trailhead.",
        messageType: MessageType.TEXT,
        senderId: users[4].id, // Alex
        conversationId: groupConversation2.id,
        createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 15),
      },
    }),
    prisma.message.create({
      data: {
        content: "Perfect! I'll bring snacks and water for everyone 🥤",
        messageType: MessageType.TEXT,
        senderId: users[7].id, // Amy
        conversationId: groupConversation2.id,
        createdAt: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 10),
      },
    }),
  ])

  console.log('✅ Seed completed successfully!')
  console.log('📊 Summary:')
  console.log(`   - Created ${users.length} users`)
  console.log(`   - Created 2 direct message conversations`)
  console.log(`   - Created 2 group conversations`)
  console.log(`   - Created messages with realistic timestamps`)
  console.log(`   - All users have password: "password123"`)
}

main()
  .catch(e => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
