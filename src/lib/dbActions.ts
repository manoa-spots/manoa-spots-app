'use server';

import { Spot, Prisma } from '@prisma/client';
import { hash } from 'bcrypt';
import { redirect } from 'next/navigation';
import { prisma } from './prisma';

type SpotInput = {
  name: string;
  description: string;
  imageUrl: string;
  rating: number;
  numReviews: number;
  address: string;
  zipCode: string;
  hasOutlets: boolean;
  hasParking: string;
  hasFoodDrinks: boolean;
  maxGroupSize: number;
  type: 'LIBRARY' | 'CAFE' | 'OUTDOOR' | 'OTHER';
  hours: Prisma.InputJsonValue;
};

const defaultHours = {
  monday: '9:00 AM - 5:00 PM',
  tuesday: '9:00 AM - 5:00 PM',
  wednesday: '9:00 AM - 5:00 PM',
  thursday: '9:00 AM - 5:00 PM',
  friday: '9:00 AM - 5:00 PM',
  saturday: 'Closed',
  sunday: 'Closed',
} as const;

/**
 * Adds a new spot to the database.
 * @param spot The spot data to add
 */
export async function addSpot(spot: SpotInput) {
  await prisma.spot.create({
    data: {
      name: spot.name,
      description: spot.description,
      imageUrl: spot.imageUrl,
      rating: spot.rating,
      numReviews: spot.numReviews,
      address: spot.address,
      zipCode: spot.zipCode,
      hasOutlets: spot.hasOutlets,
      hasParking: spot.hasParking,
      hasFoodDrinks: spot.hasFoodDrinks,
      maxGroupSize: spot.maxGroupSize,
      type: spot.type,
      hours: spot.hours || defaultHours,
    },
  });
  redirect('/list');
}

/**
 * Edits an existing spot in the database.
 * @param spot The spot data to update
 */
export async function editSpot(spot: Spot & { hours: Prisma.InputJsonValue }) {
  await prisma.spot.update({
    where: { id: spot.id },
    data: {
      name: spot.name,
      description: spot.description,
      imageUrl: spot.imageUrl,
      rating: spot.rating,
      numReviews: spot.numReviews,
      address: spot.address,
      zipCode: spot.zipCode,
      hasOutlets: spot.hasOutlets,
      hasParking: spot.hasParking,
      hasFoodDrinks: spot.hasFoodDrinks,
      maxGroupSize: spot.maxGroupSize,
      type: spot.type,
      hours: spot.hours,
    },
  });
  redirect('/list');
}

/**
 * Deletes an existing spot from the database.
 * @param id The ID of the spot to delete
 */
export async function deleteSpot(id: string) {
  await prisma.spot.delete({
    where: { id },
  });
  redirect('/list');
}

/**
 * Creates a new user in the database.
 * @param credentials The user credentials
 */
export async function createUser(credentials: { email: string; password: string }) {
  const password = await hash(credentials.password, 10);
  await prisma.user.create({
    data: {
      email: credentials.email,
      password,
      role: 'USER', // Setting default role
    },
  });
}

/**
 * Changes the password of an existing user in the database.
 * @param credentials The user credentials
 */
export async function changePassword(credentials: { email: string; password: string }) {
  const password = await hash(credentials.password, 10);
  await prisma.user.update({
    where: { email: credentials.email },
    data: {
      password,
    },
  });
}
