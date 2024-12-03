/* eslint-disable no-await-in-loop */
import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcrypt';
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
  for (const account of config.defaultAccounts) {
    let role: Role = 'USER';
    if (account.role === 'ADMIN') {
      role = 'ADMIN';
    }
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
  }

  // Create spots
  console.log('Creating spots...');
  const spots = await Promise.all([
    prisma.spot.upsert({
      where: { name: 'Hamilton Library' },
      update: {},
      create: {
        name: 'Hamilton Library',
        description: 'Quiet study space with multiple floors',
        imageUrl: 'https://www.hawaii.edu/news/wp-content/uploads/2020/10/manoa-hamilton-library-signs.jpg',
        rating: 4.5,
        numReviews: 125,
        address: '2550 McCarthy Mall, Honolulu, HI 96822',
        latitude: 21.3001,
        longitude: -157.8161,
        hasOutlets: true,
        hasParking: true,
        hasFoodDrinks: false,
        maxGroupSize: 6,
        type: 'LIBRARY',
      },
    }),
    prisma.spot.upsert({
      where: { name: 'Sinclair Library' },
      update: {},
      create: {
        name: 'Sinclair Library',
        description: '24/7 study space with comfortable seating',
        imageUrl:
        'https://historichawaii.org/wp-content/uploads/2014/02/Oahu_Honolulu_CampusRoad_2425_photo_byIanClagstone.jpg',
        rating: 3.2,
        numReviews: 89,
        address: '2425 Campus Rd, Honolulu, HI 96822',
        latitude: 21.2999,
        longitude: -157.8190,
        hasOutlets: true,
        hasParking: true,
        hasFoodDrinks: true,
        maxGroupSize: 4,
        type: 'LIBRARY',
      },
    }),
    prisma.spot.upsert({
      where: { name: 'Island Brew Coffee House' },
      update: {},
      create: {
        name: 'Island Brew Coffee House',
        description: 'Good coffee and pastries with indoor seating',
        imageUrl:
        'https://www.islandbrewcoffeehouse.com/uploads/1/3/7/0/13708134/ffea10a9-7143-47ff-99aa-3726e676211f_orig.jpeg',
        rating: 5.0,
        numReviews: 20,
        address: '1810 University Ave, Honolulu, HI 96822',
        latitude: 21.2999,
        longitude: -157.8190,
        hasOutlets: true,
        hasParking: false,
        hasFoodDrinks: true,
        maxGroupSize: 4,
        type: 'CAFE',
      },
    }),
  ]);

  console.log('Spots created successfully');

  // Create users and profiles
  console.log('Creating users and profiles...');
  for (const userData of users) {
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
    if (spots.length > 0) {
      await prisma.review.create({
        data: {
          rating: 4,
          comment: 'Great study spot!',
          userId: user.id,
          spotId: spots[0].id,
        },
      });
    }
  }

  console.log('Seeding completed');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
