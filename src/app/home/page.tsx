import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/authOptions';
import type { Spot } from '@prisma/client';
import HomeClient from '@/components/HomeClient';

async function getSpots(): Promise<(Spot & { _count: { reviews: number } })[]> {
  return prisma.spot.findMany({
    include: {
      _count: {
        select: { reviews: true },
      },
    },
  });
}

export default async function Home() {
  try {
    const spots = await getSpots();

    // Get the current user's session
    const session = await getServerSession(authOptions);
    const currentUserId = session?.user?.id || '';

    const favoriteSpots = currentUserId
      ? await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/favorites?userId=${currentUserId}`).then(
        (res) => res.json(),
      )
      : [];

    return (
      <HomeClient spots={spots} userId={currentUserId} favoriteSpots={favoriteSpots} />
    );
  } catch (error) {
    console.error('Error fetching spots:', error);
    return (
      <main>
        <div>Error loading spots. Please try again later.</div>
      </main>
    );
  }
}
