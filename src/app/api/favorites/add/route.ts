/* eslint-disable import/no-named-as-default */
/* eslint-disable import/prefer-default-export */
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { userId: bodyUserId, spotId } = await req.json();
    const userId = bodyUserId || session?.user?.id; // Fallback to session userId

    console.log('Add Favorite API:', { userId, spotId });

    if (!userId || !spotId) {
      console.error('Missing data:', { userId, spotId });
      return NextResponse.json({ error: 'Missing userId or spotId' }, { status: 400 });
    }

    // Use Prisma transaction to ensure atomic operations
    const transaction = await prisma.$transaction(async (tx) => {
      // Validate user and spot existence
      const user = await tx.user.findUnique({ where: { id: userId } });
      const spot = await tx.spot.findUnique({ where: { id: spotId } });

      if (!user || !spot) {
        console.error('User or Spot not found:', { user, spot });
        throw new Error('User or Spot does not exist');
      }

      // Create the favorite
      const favorite = await tx.favorite.create({
        data: { userId, spotId },
      });

      return favorite;
    });

    console.log('Favorite created:', transaction);
    return NextResponse.json(transaction);
  } catch (error) {
    // Safely handle error of type 'unknown'
    if (error instanceof Error) {
      console.error('Error adding favorite:', error.message);
      if (error.message === 'User or Spot does not exist') {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
    } else {
      console.error('Unexpected error:', error);
    }

    return NextResponse.json({ error: 'Failed to add favorite' }, { status: 500 });
  }
}
