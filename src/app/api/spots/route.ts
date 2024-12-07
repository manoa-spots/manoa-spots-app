/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-named-as-default */
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Named export for the GET method
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    // Parse query parameters
    const query = url.searchParams.get('q')?.toLowerCase();
    const hasOutlets = url.searchParams.get('hasOutlets') === 'true';
    const hasParking = url.searchParams.get('hasParking'); // Get raw value
    const hasFoodDrinks = url.searchParams.get('hasFoodDrinks') === 'true';
    const maxGroupSize = parseInt(url.searchParams.get('maxGroupSize') || '0', 10);
    const type = url.searchParams.get('type')?.toLowerCase();

    // Construct filters
    const filters: Prisma.SpotWhereInput[] = [];

    if (query) {
      filters.push({
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { type: { contains: query, mode: 'insensitive' } },
          { address: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      });
    }
    if (hasOutlets) filters.push({ hasOutlets: true });
    // Handle hasParking as a string filter
    if (hasParking === 'true') {
      filters.push({
        hasParking: {
          notIn: ['No', 'none', 'None', ''],
        },
      });
    }
    if (hasFoodDrinks) filters.push({ hasFoodDrinks: true });
    if (maxGroupSize) filters.push({ maxGroupSize: { gte: maxGroupSize } });
    if (type) filters.push({ type: { contains: type, mode: 'insensitive' } });

    // Execute the query
    const spots = await prisma.spot.findMany({
      where: filters.length > 0 ? { AND: filters } : {}, // Apply filters only if present
    });

    console.log('Query results:', spots); // Debugging
    return NextResponse.json(spots || []);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch spots' }, { status: 500 });
  }
}
