/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-named-as-default */
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { userId, spotId } = await req.json();

    if (!userId || !spotId) {
      return NextResponse.json({ error: 'Missing userId or spotId' }, { status: 400 });
    }

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
