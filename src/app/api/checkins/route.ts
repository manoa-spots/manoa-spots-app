import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

export const POST = async (request: NextRequest) => {
  const { userId, spotId, duration, busyness, notes } = await request.json();

  try {
    // End any existing check-ins
    await prisma.checkIn.updateMany({
      where: {
        userId,
        status: 'active',
      },
      data: {
        status: 'completed',
        endedAt: new Date(),
      },
    });

    // Create new check-in
    const checkIn = await prisma.checkIn.create({
      data: {
        userId,
        spotId,
        status: 'active',
        duration,
        busyness,
        notes: notes || '',
      },
    });

    return Response.json(checkIn);
  } catch (error) {
    return Response.json(
      { message: 'Error creating check-in' },
      { status: 500 },
    );
  }
};

export const PUT = async (request: NextRequest) => {
  const { checkInId } = await request.json();

  try {
    const checkIn = await prisma.checkIn.update({
      where: {
        id: checkInId,
      },
      data: {
        status: 'completed',
        endedAt: new Date(),
      },
    });

    return Response.json(checkIn);
  } catch (error) {
    return Response.json(
      { message: 'Error ending check-in' },
      { status: 500 },
    );
  }
};
