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

async function main() {
  try {
    console.log('Starting database seeding...');
    await seedDefaultAccounts();
    const createdSpots = await seedSpots();
    await seedUsersAndProfiles(createdSpots);
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
