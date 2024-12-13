/* eslint-disable import/prefer-default-export */
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

type Params = {
  params: {
    userId: string,
  },
};

// Change from 'export async function GET' to 'export const GET'
export const GET = async (request: NextRequest, { params }: Params) => {
  const { userId } = params;

  try {
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { senderId: userId, status: 'accepted' },
          { receiverId: userId, status: 'accepted' },
        ],
      },
    });

    const friendIds = friendships.map((friendship) => (
      friendship.senderId === userId ? friendship.receiverId : friendship.senderId
    ));

    const activities = await prisma.checkIn.findMany({
      where: {
        userId: { in: friendIds },
        status: 'active',
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        spot: {
          select: {
            id: true,
            name: true,
            address: true,
            hasOutlets: true,
            hasFoodDrinks: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return Response.json(activities);
  } catch (error) {
    console.error('Error fetching friend activity:', error);
    return Response.json(
      { message: 'Error fetching friend activity' },
      { status: 500 },
    );
  }
};
