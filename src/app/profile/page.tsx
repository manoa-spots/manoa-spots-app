/* eslint-disable react/no-array-index-key */

'use client';

import { useState, ChangeEvent } from 'react';
import { Container, Row, Col, Image, Button, Form } from 'react-bootstrap';

const ProfilePage = () => {
  // State variables for the profile information
  const [user, setUser] = useState({
    name: 'Jane Doe',
    profilePic: '/images/profile.jpg', // Replace with actual image path
    interests: ['Cafés', 'Matcha', 'Boba', 'Libraries'],
    year: 'Senior',
    major: 'ICS',
    courses: ['ICS 314', 'ICS 311', 'ICS 212'],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editUser, setEditUser] = useState({ ...user });

  // Toggle between edit and view modes
  const toggleEdit = () => {
    if (isEditing) {
      setUser(editUser); // Save changes
    } else {
      setEditUser(user); // Reset edits to the current state
    }
    setIsEditing(!isEditing);
  };

  // Handle form changes (generalized to handle all form controls)
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditUser({ ...editUser, [name]: value });
  };

  // Handle changes to interests (text input)
  const handleInterestsChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const updatedInterests = [...editUser.interests];
    updatedInterests[index] = e.target.value;
    setEditUser({ ...editUser, interests: updatedInterests });
  };

  // Handle changes to courses (text input)
  const handleCoursesChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const updatedCourses = [...editUser.courses];
    updatedCourses[index] = e.target.value;
    setEditUser({ ...editUser, courses: updatedCourses });
  };

  // Handle profile picture change
  const handleProfilePicChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditUser({ ...editUser, profilePic: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Container className="my-4">
      {/* Profile Header */}
      <Row className="align-items-center mb-4">
        <Col xs={12} md={4} className="text-center">
          <Image
            src={editUser.profilePic}
            roundedCircle
            alt={`${editUser.name}'s profile picture`}
            style={{ width: '200px', height: '200px', objectFit: 'cover' }}
          />
          {isEditing && (
            <Form.Group className="mt-3">
              <Form.Label>Change Profile Picture</Form.Label>
              <Form.Control
                type="file"
                onChange={handleProfilePicChange}
              />
            </Form.Group>
          )}
        </Col>
        <Col xs={12} md={8}>
          {isEditing ? (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={editUser.name}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Year</Form.Label>
                <Form.Control
                  type="text"
                  name="year"
                  value={editUser.year}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Major</Form.Label>
                <Form.Control
                  type="text"
                  name="major"
                  value={editUser.major}
                  onChange={handleChange}
                />
              </Form.Group>
            </>
          ) : (
            <>
              <h1>{editUser.name}</h1>
              <p>
                <strong>Year:</strong>
                {' '}
                {editUser.year}
              </p>
              <p>
                <strong>Major:</strong>
                {' '}
                {editUser.major}
              </p>
            </>
          )}
          <Button variant="primary" onClick={toggleEdit}>
            {isEditing ? 'Save' : 'Edit'}
          </Button>
        </Col>
      </Row>

      {/* Interests Section */}
      <Row className="mb-4">
        <Col>
          <h2>Interests</h2>
          {isEditing ? (
            <ul>
              {editUser.interests.map((interest, index) => (
                <li key={index}>
                  <Form.Control
                    type="text"
                    value={interest}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleInterestsChange(e, index)}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <ul>
              {editUser.interests.map((interest, index) => (
                <li key={index}>{interest}</li>
              ))}
            </ul>
          )}
        </Col>
      </Row>

      {/* Courses Section */}
      <Row className="mb-4">
        <Col>
          <h2>Courses</h2>
          {isEditing ? (
            <ul>
              {editUser.courses.map((course, index) => (
                <li key={index}>
                  <Form.Control
                    type="text"
                    value={course}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleCoursesChange(e, index)}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <ul>
              {editUser.courses.map((course, index) => (
                <li key={index}>{course}</li>
              ))}
            </ul>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
