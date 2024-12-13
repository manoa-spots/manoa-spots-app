import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

export const POST = async (request: NextRequest) => {
  const { userId, spotId } = await request.json();

  try {
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

    const checkIn = await prisma.checkIn.create({
      data: {
        userId,
        spotId,
        status: 'active',
      },
    });

    return Response.json(checkIn);
  } catch (error) {
    console.error('Error creating check-in:', error);
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
      where: { id: checkInId },
      data: {
        status: 'completed',
        endedAt: new Date(),
      },
    });

    return Response.json(checkIn);
  } catch (error) {
    console.error('Error ending check-in:', error);
    return Response.json(
      { message: 'Error ending check-in' },
      { status: 500 },
    );
  }
};
