/* eslint-disable import/prefer-default-export */
// eslint-disable-next-line import/no-named-as-default
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = url.searchParams.get('q')?.toLowerCase();

  try {
    const spots = await prisma.spot.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { type: { contains: query, mode: 'insensitive' } },
          { address: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
    });
    return NextResponse.json(spots);
  } catch (error) {
    console.error('Error fetching spots:', error);
    return NextResponse.json({ error: 'Failed to fetch spots' }, { status: 500 });
  }
}
