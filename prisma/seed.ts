import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcrypt';
import spots from './seed/spotData';
import * as config from '../config/settings.development.json';

const prisma = new PrismaClient();

const users = [
  {
    email: 'student1@hawaii.edu',
    password: 'changeme',
    role: 'USER' as Role,
    profile: {
      firstName: 'John',
      lastName: 'Doe',
      bio: 'Computer Science student who loves finding new study spots',
      picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      interests: ['Coffee Shops', 'Programming', 'Libraries', 'Quiet Spaces'],
      courses: ['ICS 314', 'ICS 311', 'ICS 321'],
    },
  },
  {
    email: 'student2@hawaii.edu',
    password: 'changeme',
    role: 'USER' as Role,
    profile: {
      firstName: 'Jane',
      lastName: 'Smith',
      bio: 'Graduate student studying Marine Biology',
      picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
      interests: ['Study Groups', 'Marine Biology', 'Outdoor Spaces', 'Research'],
      courses: ['BIOL 375', 'MARE 484', 'BIOL 485'],
    },
  },
  {
    email: 'student3@hawaii.edu',
    password: 'changeme',
    role: 'USER' as Role,
    profile: {
      firstName: 'Bob',
      lastName: 'Wilson',
      bio: 'Computer Engineering student',
      picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
      interests: ['Electronics', 'Engineering', 'Group Study', 'Cafes'],
      courses: ['EE 211', 'EE 260', 'EE 315'],
    },
  },
  {
    email: 'admin@hawaii.edu',
    password: 'changeme',
    role: 'ADMIN' as Role,
    profile: {
      firstName: 'Admin',
      lastName: 'User',
      bio: 'System administrator',
      picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
      interests: ['System Administration', 'Network Security'],
      courses: ['ICS 400'],
    },
  },
];

async function seedDefaultAccounts() {
  console.log('Seeding default accounts...');
  const password = await hash('changeme', 10);

  const accountPromises = config.defaultAccounts.map(async (account) => {
    const role: Role = account.role === 'ADMIN' ? 'ADMIN' : 'USER';
    console.log(`  Creating user: ${account.email} with role: ${role}`);
    return prisma.user.upsert({
      where: { email: account.email },
      update: {},
      create: {
        email: account.email,
        password,
        role,
      },
    });
  });

  await Promise.all(accountPromises);
}

async function seedSpots() {
  console.log('Cleaning existing spots and reviews...');
  await prisma.review.deleteMany({});
  await prisma.spot.deleteMany({});

  console.log('Creating spots...');
  const spotPromises = spots.map(async (spot) => {
    try {
      console.log(`  Creating spot: ${spot.name}`);
      const createdSpot = await prisma.spot.create({
        data: spot,
      });
      console.log(`    ✓ Created spot: ${spot.name}`);
      return createdSpot;
    } catch (error) {
      console.error(`    ✗ Failed to create spot ${spot.name}:`, error);
      throw error;
    }
  });

  return Promise.all(spotPromises);
}

async function seedUsersAndProfiles(createdSpots: any[]) {
  console.log('Creating users and profiles...');
  const userPromises = users.map(async (userData) => {
    try {
      const hashedPassword = await hash(userData.password, 10);
      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: {
          email: userData.email,
          password: hashedPassword,
          role: userData.role,
        },
      });

      await prisma.profile.upsert({
        where: { email: userData.email },
        update: {},
        create: {
          email: userData.email,
          firstName: userData.profile.firstName,
          lastName: userData.profile.lastName,
          bio: userData.profile.bio,
          picture: userData.profile.picture,
          interests: userData.profile.interests,
          courses: userData.profile.courses,
        },
      });

      if (createdSpots.length > 0) {
        return await prisma.review.create({
          data: {
            rating: 4,
            comment: 'Great study spot!',
            userId: user.id,
            spotId: createdSpots[0].id,
          },
        });
      }
      return user;
    } catch (error) {
      console.error(`Failed to create user ${userData.email}:`, error);
      throw error;
    }
  });

  return Promise.all(userPromises);
}

async function seedFriendships() {
  console.log('Creating friendships...');
  try {
    const student1 = await prisma.user.findUnique({ where: { email: 'student1@hawaii.edu' } });
    const student2 = await prisma.user.findUnique({ where: { email: 'student2@hawaii.edu' } });
    const student3 = await prisma.user.findUnique({ where: { email: 'student3@hawaii.edu' } });

    if (!student1 || !student2 || !student3) {
      throw new Error('Required users not found');
    }

    const friendships = [
      {
        senderId: student1.id,
        receiverId: student2.id,
        status: 'accepted',
      },
      {
        senderId: student2.id,
        receiverId: student3.id,
        status: 'accepted',
      },
      {
        senderId: student3.id,
        receiverId: student1.id,
        status: 'pending',
      },
    ];

    // Fixed the ESLint warning by using Promise.all
    await Promise.all(
      friendships.map(friendship => prisma.friendship.create({
        data: friendship,
      })),
    );

    console.log('✓ Friendships created successfully');
  } catch (error) {
    console.error('Error creating friendships:', error);
    throw error;
  }
}

async function main() {
  try {
    console.log('Starting database seeding...');
    await seedDefaultAccounts();
    const createdSpots = await seedSpots();
    await seedUsersAndProfiles(createdSpots);
    await seedFriendships();
    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((error) => {
    console.error('Failed to seed database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
