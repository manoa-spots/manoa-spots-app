// src/app/api/checkins/route.ts
/* eslint-disable import/prefer-default-export */
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

interface CheckInRequest {
  userId: string;
  spotId: string;
  duration: number;
  busyness: string;
  notes?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as CheckInRequest;
    console.log('Received check-in request:', body);

    // Validate request data
    const { userId, spotId, duration, busyness, notes } = body;

    if (!userId || !spotId || !busyness) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

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
        duration: Number(duration) || 60,
        busyness,
        notes: notes || '',
      },
    });

    console.log('Created check-in:', checkIn);

    return Response.json(checkIn);
  } catch (error) {
    console.error('Server error in check-in:', error);
    return Response.json(
      {
        error: 'Failed to create check-in',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { checkInId } = await request.json();

    if (!checkInId) {
      return Response.json(
        { error: 'Missing checkInId' },
        { status: 400 },
      );
    }

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
    console.error('Error in check-out:', error);
    return Response.json(
      {
        error: 'Failed to update check-in',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
