'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import SpotCard from '@/components/SpotCard';
import FilterForm from '@/components/FilterForm';
import type { Spot } from '@prisma/client';

const SearchPage: React.FC = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.trim().toLowerCase() || '';
  const [spots, setSpots] = useState<Spot[]>([]);
  const [filters, setFilters] = useState({
    hasOutlets: false,
    hasParking: false,
    hasFoodDrinks: false,
    maxGroupSize: '',
    type: '',
  });

  const handleApplyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const params = new URLSearchParams({
          q: query,
          hasOutlets: filters.hasOutlets.toString(),
          hasParking: filters.hasParking.toString(),
          hasFoodDrinks: filters.hasFoodDrinks.toString(),
          maxGroupSize: filters.maxGroupSize || '',
          type: filters.type || '',
        });

        const response = await fetch(`/api/spots?${params.toString()}`);

        if (!response.ok) {
          console.error('API Error:', await response.text());
          setSpots([]); // Set spots to an empty array on API error
          return;
        }

        const text = await response.text(); // Fetch the raw text response
        if (text) {
          const data = JSON.parse(text); // Parse only if text is not empty
          setSpots(data);
        } else {
          setSpots([]); // Handle empty response gracefully
        }
      } catch (error) {
        console.error('Fetch Error:', error); // Log any fetch errors
        setSpots([]); // Set spots to an empty array on fetch failure
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
                  <SpotCard spot={spot} />
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

export default SearchPage;
