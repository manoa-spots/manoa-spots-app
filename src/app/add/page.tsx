// src/app/add/page.tsx
import { getServerSession } from 'next-auth';
import AddSpotForm from '@/components/AddSpotForm';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';
import { loggedInProtectedPage, type Session } from '../../lib/page-protection';
import { authOptions } from '../../lib/authOptions';

const AddSpot = async () => {
  const session = await getServerSession(authOptions);
  loggedInProtectedPage(session as Session);

  return (
    <main>
      {/* Hero Section */}
      <div className="position-relative bg-light mb-4" style={{ height: '250px', overflow: 'hidden' }}>
        <Image
          src="/images/background.png" // You'll need to add this image to your public folder
          alt="Study space header"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <div
          className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
        >
          <div className="text-center text-white">
            <h1 className="display-4 fw-bold">Share your spot</h1>
            <p className="lead">Help others discover great places to study around campus</p>
          </div>
        </div>
      </div>

      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <AddSpotForm />
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default AddSpot;
