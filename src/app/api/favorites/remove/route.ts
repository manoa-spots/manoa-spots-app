/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-named-as-default */
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(req: Request) {
  try {
    const { userId, spotId } = await req.json();

    if (!userId || !spotId) {
      return NextResponse.json({ error: 'Missing userId or spotId' }, { status: 400 });
    }

    await prisma.favorite.deleteMany({
      where: {
        userId,
        spotId,
      },
    });

    return NextResponse.json({ message: 'Favorite removed successfully' });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json({ error: 'Failed to remove favorite' }, { status: 500 });
  }
}
