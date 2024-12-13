// src/app/api/spots/busyness/route.ts
/* eslint-disable import/prefer-default-export */
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const spotId = searchParams.get('spotId');

    if (!spotId) {
      return Response.json(
        { error: 'spotId is required' },
        { status: 400 },
      );
    }

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

    let avgBusyness = 'quiet';
    if (activeCheckIns.length > 0) {
      const busynessLevels = {
        empty: 0,
        quiet: 1,
        moderate: 2,
        busy: 3,
        full: 4,
      };

      const sum = activeCheckIns.reduce(
        (acc, curr) => acc + busynessLevels[curr.busyness as keyof typeof busynessLevels],
        0,
      );
      const avg = sum / activeCheckIns.length;

      const busynessEntry = Object.entries(busynessLevels)
        .find(([, value]) => value === Math.round(avg));
      avgBusyness = busynessEntry?.[0] || 'quiet';
    }

    const responseData = {
      currentBusyness: avgBusyness,
      activeCheckIns: activeCheckIns.length,
    };

    return new Response(
      JSON.stringify(responseData),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Error in busyness API:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch busyness data' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
}
