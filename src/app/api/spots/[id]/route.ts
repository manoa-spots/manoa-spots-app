import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// eslint-disable-next-line import/prefer-default-export
export async function GET(
  _request: Request,
  { params }: { params: { id: string }, },
) {
  try {
    const spot = await prisma.spot.findUnique({
      where: {
        id: params.id,
      },
      include: {
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    if (!spot) {
      return new NextResponse(
        JSON.stringify({ error: 'Spot not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    return NextResponse.json(spot);
  } catch (error) {
    console.error('Error fetching spot:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch spot details' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
