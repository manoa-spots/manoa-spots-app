// src/app/api/checkins/route.ts
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

// Remove 'default' and use named export
export async function POST(request: NextRequest) {
  try {
    const { userId, spotId, duration, busyness, notes } = await request.json();
    console.log('Creating check-in with data:', { userId, spotId, duration, busyness });

    const endedCheckins = await prisma.checkIn.updateMany({
      where: {
        userId,
        status: 'active',
      },
      data: {
        status: 'completed',
        endedAt: new Date(),
      },
    });

    console.log('Ended previous check-ins:', endedCheckins);

    const newCheckIn = await prisma.checkIn.create({
      data: {
        userId,
        spotId,
        status: 'active',
        duration: parseInt(duration.toString(), 10),
        busyness,
        notes: notes || '',
      },
    });

    console.log('Check-in created:', newCheckIn); // Add logging

    console.log('Created new check-in:', newCheckIn);
    return Response.json(newCheckIn);
  } catch (error) {
    console.error('Error in check-in API:', error);
    return Response.json(
      { error: 'Failed to create check-in' },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { checkInId } = await request.json();

    const updatedCheckIn = await prisma.checkIn.update({
      where: {
        id: checkInId,
      },
      data: {
        status: 'completed',
        endedAt: new Date(),
      },
    });

    return Response.json(updatedCheckIn);
  } catch (error) {
    console.error('Error in check-out API:', error);
    return Response.json(
      { error: 'Failed to update check-in' },
      { status: 500 },
    );
  }
}
