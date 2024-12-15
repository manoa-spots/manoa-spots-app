'use client';

import { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import SpotCard from '@/components/SpotCard';
import type { Spot } from '@prisma/client';

interface FavoriteContentProps {
  userId: string;
}

const FavoriteContent = ({ userId }: FavoriteContentProps) => {
  const [favoriteSpots, setFavoriteSpots] = useState<(Spot & { _count: { reviews: number } })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch(`/api/favorites?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setFavoriteSpots(data.map((fav: any) => fav.spot));
        } else {
          console.error('Failed to fetch favorite spots');
        }
      } catch (error) {
        console.error('Error fetching favorite spots:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchFavorites();
  }, [userId]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <p>Loading your favorites...</p>
      </div>
    );
  }

  return (
    <Container className="py-5">
      {favoriteSpots.length > 0 ? (
        <Row xs={1} md={2} lg={3} className="g-4">
          {favoriteSpots.map((spot) => (
            <Col key={spot.id}>
              <SpotCard spot={spot} userId={userId} />
            </Col>
          ))}
        </Row>
      ) : (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
          <p className="text-muted fs-4">You haven’t favorited any spots yet!</p>
        </div>
      )}
    </Container>
  );
};

export default FavoriteContent;
