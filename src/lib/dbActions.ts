'use server';

import { Spot } from '@prisma/client';
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
  latitude: number;
  longitude: number;
  hasOutlets: boolean;
  hasParking: boolean;
  hasFoodDrinks: boolean;
  maxGroupSize: number;
  type: 'LIBRARY' | 'CAFE' | 'OTHER';
};

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
      latitude: spot.latitude,
      longitude: spot.longitude,
      hasOutlets: spot.hasOutlets,
      hasParking: spot.hasParking,
      hasFoodDrinks: spot.hasFoodDrinks,
      maxGroupSize: spot.maxGroupSize,
      type: spot.type,
    },
  });
  redirect('/list');
}

/**
 * Edits an existing spot in the database.
 * @param spot The spot data to update
 */
export async function editSpot(spot: Spot) {
  await prisma.spot.update({
    where: { id: spot.id },
    data: {
      name: spot.name,
      description: spot.description,
      imageUrl: spot.imageUrl,
      rating: spot.rating,
      numReviews: spot.numReviews,
      address: spot.address,
      latitude: spot.latitude,
      longitude: spot.longitude,
      hasOutlets: spot.hasOutlets,
      hasParking: spot.hasParking,
      hasFoodDrinks: spot.hasFoodDrinks,
      maxGroupSize: spot.maxGroupSize,
      type: spot.type,
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
