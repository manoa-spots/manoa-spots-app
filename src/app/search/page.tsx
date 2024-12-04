'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import SpotCard from '@/components/SpotCard';
import type { Spot } from '@prisma/client';

const SearchPage: React.FC = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.trim().toLowerCase() || '';
  const [spots, setSpots] = useState<Spot[]>([]);

  useEffect(() => {
    if (!query) return; // Avoid unnecessary fetches if there's no query
    fetch(`/api/spots?q=${encodeURIComponent(query)}`) // Pass the query to the API
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched spots:', data); // Log for debugging
        setSpots(data); // Update the state with the fetched spots
      })
      .catch((err) => console.error('Error fetching spots:', err));
  }, [query]);

  const filteredSpots = spots.filter(
    (spot) => spot.name.toLowerCase().includes(query)
      || spot.type.toLowerCase().includes(query)
      || spot.address.toLowerCase().includes(query)
      || spot.description?.toLowerCase().includes(query),
  );

  console.log('Filtered spots:', filteredSpots); // Debugging

  return (
    <Container>
      <div className="mt-5">
        <h1>
          Spot Results
        </h1>
      </div>
      <Row>
        {filteredSpots.length > 0 ? (
          filteredSpots.map((spot) => (
            <Col md={4} key={spot.id} className="mb-4">
              <SpotCard spot={spot} />
            </Col>
          ))
        ) : (
          <p>Sorry, no spots match your search query. Try searching for a different spot or add your own!</p>
        )}
      </Row>
    </Container>
  );
};

export default SearchPage;
