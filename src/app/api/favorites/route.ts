/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-named-as-default */
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get('userId') || undefined;

  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: { spot: true },
    });

    return NextResponse.json(favorites);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
  }
}
