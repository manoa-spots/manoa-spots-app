import { Container, Row, Col } from 'react-bootstrap';
import { PageIDs } from '@/utilities/ids';
import SpotCard from '@/components/SpotCard';
import type { Spot } from '@prisma/client';
import { prisma } from '@/lib/prisma';

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

    return (
      <main>
        <div id={PageIDs.landingPage}>
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
                      <SpotCard spot={spot} />
                    </Col>
                  ))}
                </Row>
              </Container>
            </Container>
          </div>
        </div>
      </main>
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