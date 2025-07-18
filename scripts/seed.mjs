import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const seedUser = {
  email: 'test.user@example.com',
  password: 'password123',
  name: 'Test User',
};

async function main() {
  // Clean up existing data
  await prisma.source.deleteMany({});
  await prisma.collection.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Create a test user
  const hashedPassword = await bcrypt.hash(seedUser.password, 10);
  const user = await prisma.user.create({
    data: {
      email: seedUser.email,
      password: hashedPassword,
      name: seedUser.name,
    },
  });

  // 2. Create collections and sources for the user
  await prisma.collection.create({
    data: {
      userId: user.id,
      name: 'Week of July 5th, 2025',
      status: 'Saved',
      sources: {
        create: [
          {
            name: 'Acquired',
            url: 'https://open.spotify.com/show/1TzB4nK8f4T3pUa6C3lT9t',
            imageUrl: '/placeholder.svg?width=40&height=40',
          },
          {
            name: 'All-In Podcast',
            url: 'https://open.spotify.com/show/2I3r1wZnNKh6C44i3tE0D2',
            imageUrl: '/placeholder.svg?width=40&height=40',
          },
          {
            name: 'Darknet Diaries',
            url: 'https://open.spotify.com/show/4XPl3uEEL9hvqMkoZrzbx5',
            imageUrl: '/placeholder.svg?width=40&height=40',
          },
        ],
      },
    },
  });

  await prisma.collection.create({
    data: {
      userId: user.id,
      name: 'New Weekly Curation',
      status: 'Draft',
      sources: {
        create: [
          {
            name: 'The Daily',
            url: 'https://open.spotify.com/show/3IM0lmZxpFAY72Q_...',
            imageUrl: '/placeholder.svg?width=40&height=40',
          },
          {
            name: 'Lex Fridman Podcast',
            url: 'https://open.spotify.com/show/2MAi0BvDc6GTFvKFPXnkCL',
            imageUrl: '/placeholder.svg?width=40&height=40',
          },
        ],
      },
    },
  });

  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
