/* eslint-disable react/jsx-boolean-value */
import { Container, Row, Col } from 'react-bootstrap';
import SpotCard from '@/components/SpotCard';
import type { Spot } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

async function getFavoriteSpots(userId: string): Promise<(Spot & { _count: { reviews: number } })[]> {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        spot: {
          include: {
            _count: {
              select: { reviews: true },
            },
          },
        },
      },
    });

    return favorites.map((favorite) => favorite.spot);
  } catch (error) {
    console.error('Error fetching favorite spots:', error);
    return [];
  }
}

export default async function FavoritesPage() {
  try {
    // Get current user session
    const session = await getServerSession(authOptions);
    const currentUserId = session?.user?.id || '';

    if (!currentUserId) {
      return (
        <main>
          <div className="py-5 text-center">
            <h2>You need to log in to view your favorites!</h2>
          </div>
        </main>
      );
    }

    // Fetch user's favorite spots
    const favoriteSpots = await getFavoriteSpots(currentUserId);

    return (
      <main>
        <div>
          {/* Page Header */}
          <div className="landing-hero">
            <Container className="text-center landing-hero">
              <h1
                style={{
                  fontSize: '36pt',
                  fontWeight: '600',
                  color: 'var(--primary-dark)',
                }}
              >
                Your Favorite Spots
              </h1>
            </Container>
          </div>

          {/* Favorite Spots List */}
          <div>
            <Container
              className="landing-white-background justify-content-center text-center"
              style={{ backgroundColor: 'white' }}
            >
              <Container className="py-5">
                <Row xs={1} md={2} lg={3} className="g-4">
                  {favoriteSpots.length > 0 ? (
                    favoriteSpots.map((spot) => (
                      <Col key={spot.id}>
                        <SpotCard spot={spot} userId={currentUserId} isFavorite={true} />
                      </Col>
                    ))
                  ) : (
                    <div className="container-fluid d-flex justify-content-center align-items-center">
                      <p className="text-muted fs-4 text-center">You haven’t favorited any spots yet!</p>
                    </div>

                  )}
                </Row>
              </Container>
            </Container>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error('Error fetching favorite spots:', error);
    return (
      <main>
        <div className="py-5 text-center">
          <h2>Error loading favorite spots. Please try again later.</h2>
        </div>
      </main>
    );
  }
}
