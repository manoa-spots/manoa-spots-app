'use client';

import { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import SpotCard from '@/components/SpotCard';
import type { Spot } from '@prisma/client';

interface HomeClientProps {
  spots: (Spot & { _count: { reviews: number } })[];
  userId: string;
  favoriteSpots: { spotId: string }[]; // Pass favorite spots from the server
}

export default function HomeClient({ spots, userId, favoriteSpots }: HomeClientProps) {
  const [favorites, setFavorites] = useState<string[]>(favoriteSpots.map((fav) => fav.spotId));

  const handleFavoriteToggle = async (spotId: string, isFavorite: boolean) => {
    try {
      const endpoint = isFavorite ? '/api/favorites/add' : '/api/favorites/remove';
      const method = isFavorite ? 'POST' : 'DELETE';

      await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, spotId }),
      });

      setFavorites((prevFavorites) => (isFavorite
        ? [...prevFavorites, spotId] // Add to favorites
        : prevFavorites.filter((id) => id !== spotId)));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <main>
      <div id="homePage">
        <div className="landing-hero">
          <Container className="text-center landing-hero">
            <h1
              style={{
                fontSize: '36pt',
                fontWeight: '600',
                color: 'var(--primary-dark)',
              }}
            >
              find your perfect spot!
            </h1>
          </Container>
        </div>
        <div>
          <Container
            className="landing-white-background justify-content-center text-center"
            style={{ backgroundColor: 'white' }}
          >
            <h2 className="trending">trending spots</h2>
            <Container className="py-5">
              <Row xs={1} md={2} lg={3} className="g-4">
                {spots.map((spot) => (
                  <Col key={spot.id}>
                    <SpotCard
                      spot={spot}
                      userId={userId}
                      isFavorite={favorites.includes(spot.id)} // Sync favorite state
                      onFavoriteToggle={handleFavoriteToggle}
                    />
                  </Col>
                ))}
              </Row>
            </Container>
          </Container>
        </div>
      </div>
    </main>
  );
}
