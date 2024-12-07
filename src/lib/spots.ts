// src/lib/spots.ts
import db from './db';

export async function getAllSpots() {
  try {
    return await db.spot.findMany({
      include: {
        reviews: {
          include: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  } catch (error) {
    console.error('Error fetching spots:', error);
    throw new Error('Failed to fetch spots');
  }
}

export async function getSpotById(id: string) {
  try {
    return await db.spot.findUnique({
      where: { id },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.error('Error fetching spot:', error);
    throw new Error('Failed to fetch spot');
  }
}
