/* eslint-disable import/prefer-default-export */
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const spotId = searchParams.get('spotId');

  try {
    // Get active check-ins for the spot
    const activeCheckIns = await prisma.checkIn.findMany({
      where: {
        spotId: spotId as string,
        status: 'active',
      },
      select: {
        busyness: true,
      },
    });

    console.log('Active check-ins found:', activeCheckIns); // Add logging

    // Calculate average busyness
    const busynessLevels = {
      empty: 0,
      quiet: 1,
      moderate: 2,
      busy: 3,
      full: 4,
    };

    let avgBusyness = 'quiet';
    if (activeCheckIns.length > 0) {
      const sum = activeCheckIns.reduce((acc, curr) => acc
      + busynessLevels[curr.busyness as keyof typeof busynessLevels], 0);
      const avg = sum / activeCheckIns.length;

      // Convert back to string
      const busynessEntry = Object.entries(busynessLevels)
        .find(([, value]) => value === Math.round(avg));
      avgBusyness = busynessEntry?.[0] || 'quiet';
    }

    // Update spot's current busyness
    await prisma.spot.update({
      where: {
        id: spotId as string,
      },
      data: {
        currentBusyness: avgBusyness,
      },
    });

    console.log('Calculated busyness:', { avgBusyness, activeCheckIns: activeCheckIns.length }); // Add logging

    return Response.json({
      currentBusyness: avgBusyness,
      activeCheckIns: activeCheckIns.length,
    });
  } catch (error) {
    console.error('Error fetching busyness:', error);
    return Response.json(
      { message: 'Error fetching busyness data' },
      { status: 500 },
    );
  }
};
