// src/app/api/spots/busyness/route.ts
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

const getBusyness = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const spotId = searchParams.get('spotId');

  if (!spotId) {
    return Response.json({ error: 'spotId is required' }, { status: 400 });
  }

  try {
    // Log the initial request
    console.log('Fetching busyness for spot:', spotId);

    // Get active check-ins for the spot
    const activeCheckIns = await prisma.checkIn.findMany({
      where: {
        spotId,
        status: 'active',
      },
      select: {
        busyness: true,
      },
    });

    console.log('Found active check-ins:', activeCheckIns);

    let avgBusyness = 'quiet';
    if (activeCheckIns.length > 0) {
      const busynessLevels = {
        empty: 0,
        quiet: 1,
        moderate: 2,
        busy: 3,
        full: 4,
      };

      const sum = activeCheckIns.reduce((acc, curr) => acc
      + busynessLevels[curr.busyness as keyof typeof busynessLevels], 0);
      const avg = sum / activeCheckIns.length;

      // Find the closest busyness level
      const busynessEntry = Object.entries(busynessLevels)
        .find(([, value]) => value === Math.round(avg));
      avgBusyness = busynessEntry?.[0] || 'quiet';
    }

    // Log the response
    const response = {
      currentBusyness: avgBusyness,
      activeCheckIns: activeCheckIns.length,
    };
    console.log('Sending response:', response);

    return Response.json(response);
  } catch (error) {
    console.error('Error in busyness API:', error);
    return Response.json(
      { error: 'Failed to fetch busyness data' },
      { status: 500 },
    );
  }
};

export default getBusyness;
