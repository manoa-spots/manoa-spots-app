import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

// src/app/api/checkins/route.ts
const POST = async (request: NextRequest) => {
  try {
    const { userId, spotId, duration, busyness, notes } = await request.json();
    console.log('Creating check-in with data:', { userId, spotId, duration, busyness });

    // First end any active check-ins
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

    // Create new check-in
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

    console.log('Created new check-in:', newCheckIn);
    return Response.json(newCheckIn);
  } catch (error) {
    console.error('Error in check-in API:', error);
    return Response.json(
      { error: 'Failed to create check-in' },
      { status: 500 },
    );
  }
};

export default POST;
