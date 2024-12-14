/* eslint-disable import/prefer-default-export */
import { NextResponse } from 'next/server';
// eslint-disable-next-line import/no-named-as-default
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { userId, spotId } = await req.json();

    if (!userId || !spotId) {
      return NextResponse.json({ error: 'Missing userId or spotId' }, { status: 400 });
    }

    // Check if user exists
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
      return NextResponse.json({ error: 'User does not exist' }, { status: 404 });
    }

    // Check if spot exists
    const spotExists = await prisma.spot.findUnique({ where: { id: spotId } });
    if (!spotExists) {
      return NextResponse.json({ error: 'Spot does not exist' }, { status: 404 });
    }

    // Create the favorite
    const favorite = await prisma.favorite.create({
      data: {
        userId,
        spotId,
      },
    });

    return NextResponse.json(favorite);
  } catch (error) {
    console.error('Error adding favorite:', error);
    return NextResponse.json({ error: 'Failed to add favorite' }, { status: 500 });
  }
}
