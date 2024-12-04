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
  const [filters, setFilters] = useState<{
    hasOutlets: boolean;
    hasParking: boolean;
    hasFoodDrinks: boolean;
    maxGroupSize: string;
    type: string;
  }>({
    hasOutlets: false,
    hasParking: false,
    hasFoodDrinks: false,
    maxGroupSize: '',
    type: '',
  });

  const handleApplyFilters = (newFilters: {
    hasOutlets: boolean;
    hasParking: boolean;
    hasFoodDrinks: boolean;
    maxGroupSize: string;
    type: string;
  }) => {
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
          setSpots([]); // Handle API errors gracefully
          return;
        }

        const data = await response.json(); // Parse JSON response
        setSpots(data || []); // Ensure empty array on no results
      } catch (error) {
        console.error('Fetch Error:', error); // Handle fetch errors
        setSpots([]); // Set spots to an empty array on failure
      }
    };

    fetchSpots();
  }, [query, filters]);

  return (
    <Container className="mt-5">
      <Row>
        <Col md={3}>
          <div className="filter-card p-3">
            <h4 className="filter-title">Filters</h4>
            <FilterForm onApplyFilters={handleApplyFilters} />
          </div>
        </Col>
        <Col md={9}>
          <div>
            <h4 className="mb-4">Spot Results</h4>
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
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SearchPage;
