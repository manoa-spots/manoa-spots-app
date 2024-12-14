'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import SpotCard from '@/components/SpotCard';
import FilterForm from '@/components/FilterForm';
import type { Spot } from '@prisma/client';
import { useSession } from 'next-auth/react';

interface Filters {
  hasOutlets: boolean;
  hasParking: string; // Changed from boolean to string
  hasFoodDrinks: boolean;
  maxGroupSize: string;
  type: string;
}

const SearchContent: React.FC = () => {
  const { data: session } = useSession(); // Fetch session data
  const currentUserId = session?.user?.id || ''; // Extract userId from session
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.trim().toLowerCase() || '';
  const [spots, setSpots] = useState<Spot[]>([]);
  const [filters, setFilters] = useState<Filters>({
    hasOutlets: false,
    hasParking: 'No', // Changed default value
    hasFoodDrinks: false,
    maxGroupSize: '',
    type: '',
  });

  const handleApplyFilters = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const params = new URLSearchParams({
          q: query,
          hasOutlets: filters.hasOutlets.toString(),
          hasParking: filters.hasParking,
          hasFoodDrinks: filters.hasFoodDrinks.toString(),
          maxGroupSize: filters.maxGroupSize || '',
          type: filters.type || '',
        });

        const response = await fetch(`/api/spots?${params.toString()}`);

        if (!response.ok) {
          console.error('API Error:', await response.text());
          setSpots([]);
          return;
        }

        const text = await response.text();
        if (text) {
          const data = JSON.parse(text);
          setSpots(data);
        } else {
          setSpots([]);
        }
      } catch (error) {
        console.error('Fetch Error:', error);
        setSpots([]);
      }
    };

    fetchSpots();
  }, [query, filters]);

  return (
    <Container className="mt-5">
      <Row>
        <Col md={3}>
          <h4>Filters</h4>
          <FilterForm onApplyFilters={handleApplyFilters} />
        </Col>
        <Col md={9}>
          <h4>Spot Results</h4>
          <Row>
            {spots.length > 0 ? (
              spots.map((spot) => (
                <Col md={4} key={spot.id} className="mb-4">
                  <SpotCard spot={spot} userId={currentUserId} />
                </Col>
              ))
            ) : (
              <p>No spots match your search criteria. Try adjusting the filters!</p>
            )}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default SearchContent;
