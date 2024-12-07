import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcrypt';
import spots from './seed/spotData';
import * as config from '../config/settings.development.json';

const prisma = new PrismaClient();

// Define the users data structure
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

async function main() {
  console.log('Seeding the database');
  const password = await hash('changeme', 10);

  // Seed default accounts from config
  await Promise.all(config.defaultAccounts.map(async (account) => {
    const role: Role = account.role === 'ADMIN' ? 'ADMIN' : 'USER';
    console.log(`  Creating user: ${account.email} with role: ${role}`);
    await prisma.user.upsert({
      where: { email: account.email },
      update: {},
      create: {
        email: account.email,
        password,
        role,
      },
    });
  }));

  // Create spots from imported data
  console.log('Creating spots...');
  const createdSpots = await Promise.all(
    spots.map((spot) => prisma.spot.upsert({
      where: { name: spot.name },
      update: {},
      create: spot,
    })),
  );

  async function seedSpots() {
    try {
      console.log('Seeding spots...');
      await Promise.all(
        spots.map(async (spot) => {
          await prisma.spot.upsert({
            where: { name: spot.name },
            update: {},
            create: {
              name: spot.name,
              description: spot.description,
              imageUrl: spot.imageUrl,
              rating: spot.rating,
              numReviews: spot.numReviews,
              address: spot.address,
              zipCode: spot.zipCode,
              hours: JSON.stringify(spot.hours),
              amenities: spot.amenities,
              hasOutlets: spot.hasOutlets,
              hasParking: spot.hasParking,
              hasFoodDrinks: spot.hasFoodDrinks,
              maxGroupSize: spot.maxGroupSize,
              minGroupSize: spot.minGroupSize,
              type: spot.type,
            },
          });
        }),
      );
      console.log('Seeding completed.');
    } catch (error) {
      console.error('Error seeding spots:', error);
    } finally {
      await prisma.$disconnect();
    }
  }

  seedSpots();

  // Create users and profiles
  console.log('Creating users and profiles...');
  await Promise.all(users.map(async (userData) => {
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

    // Create some sample reviews
    if (createdSpots.length > 0) {
      await prisma.review.create({
        data: {
          rating: 4,
          comment: 'Great study spot!',
          userId: user.id,
          spotId: createdSpots[0].id,
        },
      });
    }
  }));

  console.log('Seeding completed');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
