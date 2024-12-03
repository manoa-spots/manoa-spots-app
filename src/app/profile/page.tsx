'use client';

import { Container, Row, Col, Card, Image } from 'react-bootstrap';

const ProfilePage = () => {
  // Mock data for the profile page
  const user = {
    name: 'Jane Doe',
    profilePic: '/images/profile.jpg', // Replace with actual image path
    interests: ['Cafés', 'Matcha', 'Boba', 'Libraries'],
    year: 'Senior',
    major: 'ICS',
    courses: ['ICS 314', 'ICS 311', 'ICS 212'],
    favoriteSpots: [
      {
        name: 'Broome St General Store',
        image: '/images/broome-store.jpg',
      },
      {
        name: 'Holoholo Drive-Thru Espresso',
        image: '/images/holoholo.jpg',
      },
    ],
  };

  return (
    <Container className="my-4">
      {/* Profile Header */}
      <Row className="align-items-center mb-4">
        <Col xs={12} md={4} className="text-center">
          <Image
            src={user.profilePic}
            style={{ width: '200px', objectFit: 'cover' }}
            alt={`${user.name}'s profile picture`}
          />
        </Col>
        <Col xs={12} md={8}>
          <h1>{user.name}</h1>
          <p>
            <strong>Year:</strong>
            {' '}
            {user.year}
          </p>
          <p>
            <strong>Major:</strong>
            {' '}
            {user.major}
          </p>
        </Col>
      </Row>

      {/* Interests Section */}
      <Row className="mb-4">
        <Col>
          <h2>Interests</h2>
          <ul>
            {user.interests.map((interest) => (
              <li key={interest}>{interest}</li> // Use the interest as the key
            ))}
          </ul>
        </Col>
      </Row>

      {/* Courses Section */}
      <Row className="mb-4">
        <Col>
          <h2>Courses</h2>
          <ul>
            {user.courses.map((course) => (
              <li key={course}>{course}</li>
            ))}
          </ul>
        </Col>
      </Row>

      {/* Favorite Spots Section */}
      <Row>
        <Col>
          <h2>Favorite Spots</h2>
          <Row>
            {user.favoriteSpots.map((spot) => (
              <Col key={spot.name} xs={12} md={6} className="mb-4">
                <Card>
                  <Card.Img
                    variant="top"
                    src={spot.image}
                    alt={`${spot.name} image`}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <Card.Body>
                    <Card.Title>{spot.name}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
