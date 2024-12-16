'use client';

import { useState, ChangeEvent, useEffect } from 'react';
import { Container, Row, Col, Image, Button, Form, Card } from 'react-bootstrap';
import { Clock, MapPin } from 'lucide-react';

interface Interest {
  id: string;
  value: string;
}

interface Course {
  id: string;
  value: string;
}

interface User {
  id: string;
  name: string;
  profilePic: string;
  interests: Interest[];
  year: string;
  major: string;
  courses: Course[];
}

interface Friend {
  id: string;
  email: string;
}

interface FriendRequest {
  id: string;
  sender: {
    id: string;
    email: string;
  };
}

interface Activity {
  id: string;
  user: {
    id: string;
    email: string;
  };
  spot: {
    id: string;
    name: string;
    address: string;
    hasOutlets: boolean;
    hasFoodDrinks: boolean;
  };
  createdAt: string;
}

const ProfilePage = () => {
  const [user, setUser] = useState<User>({
    id: '1',
    name: 'Jane Doe',
    profilePic: '/images/profilepic.jpg',
    interests: [
      { id: crypto.randomUUID(), value: 'Cafés' },
      { id: crypto.randomUUID(), value: 'Matcha' },
      { id: crypto.randomUUID(), value: 'Boba' },
      { id: crypto.randomUUID(), value: 'Libraries' },
    ],
    year: 'Senior',
    major: 'ICS',
    courses: [
      { id: crypto.randomUUID(), value: 'ICS 314' },
      { id: crypto.randomUUID(), value: 'ICS 311' },
      { id: crypto.randomUUID(), value: 'ICS 212' },
    ],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editUser, setEditUser] = useState<User>({ ...user });
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [friendsRes, requestsRes, activitiesRes] = await Promise.all([
          fetch(`/api/friends/${user.id}`),
          fetch(`/api/friends/requests/${user.id}`),
          fetch(`/api/friends/activity/${user.id}`),
        ]);

        const friendsData = await friendsRes.json();
        const requestsData = await requestsRes.json();
        const activitiesData = await activitiesRes.json();

        setFriends(friendsData);
        setFriendRequests(requestsData);
        setActivities(activitiesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(() => {
      fetch(`/api/friends/activity/${user.id}`)
        .then(res => res.json())
        .then(data => setActivities(data));
    }, 60000);

    return () => clearInterval(interval);
  }, [user.id]);

  const toggleEdit = () => {
    if (isEditing) {
      setUser(editUser);
    } else {
      setEditUser(user);
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditUser({ ...editUser, [name]: value });
  };

  const handleInterestsChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    id: string,
  ) => {
    setEditUser(prev => ({
      ...prev,
      interests: prev.interests.map((interest) => (
        interest.id === id ? { ...interest, value: e.target.value } : interest
      )),
    }));
  };

  const handleAddInterest = () => {
    setEditUser(prev => ({
      ...prev,
      interests: [...prev.interests, { id: crypto.randomUUID(), value: '' }],
    }));
  };

  const handleRemoveInterest = (id: string) => {
    setEditUser(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest.id !== id),
    }));
  };

  const handleCoursesChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    id: string,
  ) => {
    setEditUser(prev => ({
      ...prev,
      courses: prev.courses.map(course => (course.id === id ? { ...course, value: e.target.value } : course)),
    }));
  };

  const handleAddCourse = () => {
    setEditUser(prev => ({
      ...prev,
      courses: [...prev.courses, { id: crypto.randomUUID(), value: '' }],
    }));
  };

  const handleRemoveCourse = (id: string) => {
    setEditUser(prev => ({
      ...prev,
      courses: prev.courses.filter(course => course.id !== id),
    }));
  };

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

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const res = await fetch('/api/friends/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId }),
      });

      if (res.ok) {
        setFriendRequests(prev => prev.filter(req => req.id !== requestId));
        const friendsRes = await fetch(`/api/friends/${user.id}`);
        const friendsData = await friendsRes.json();
        setFriends(friendsData);
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const formatDuration = (startTime: string) => {
    const start = new Date(startTime);
    const now = new Date();
    const diff = Math.floor((now.getTime() - start.getTime()) / 1000 / 60);
    if (diff < 60) return `${diff}m`;
    const hours = Math.floor(diff / 60);
    return `${hours}h ${diff % 60}m`;
  };

  if (loading) {
    return (
      <Container className="my-4">
        <div>Loading...</div>
      </Container>
    );
  }

  return (
    <Container fluid className="my-4">
      <Row>
        {/* Main Profile Content */}
        <Col md={8}>
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
                    {editUser.year}
                  </p>
                  <p>
                    <strong>Major:</strong>
                    {editUser.major}
                  </p>
                </>
              )}
              <Button variant="primary" onClick={toggleEdit}>
                {isEditing ? 'Save' : 'Edit'}
              </Button>
            </Col>
          </Row>

          {/* Friend Requests Section */}
          {friendRequests.length > 0 && (
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Friend Requests</h5>
              </Card.Header>
              <Card.Body>
                {friendRequests.map((request) => (
                  <div key={request.id} className="d-flex justify-content-between align-items-center mb-2">
                    <span>{request.sender.email}</span>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAcceptRequest(request.id)}
                    >
                      Accept
                    </Button>
                  </div>
                ))}
              </Card.Body>
            </Card>
          )}

          {/* Friends List Section */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Friends</h5>
            </Card.Header>
            <Card.Body>
              {friends.length === 0 ? (
                <p className="text-muted">No friends added yet</p>
              ) : (
                <div className="d-flex flex-wrap gap-3">
                  {friends.map((friend) => (
                    <div key={friend.id} className="d-flex align-items-center">
                      <div className="rounded-circle bg-secondary" style={{ width: 40, height: 40 }} />
                      <div className="ms-2">
                        <p className="mb-0 fw-medium">{friend.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Interests Section */}
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Interests</h5>
              {isEditing && (
                <Button variant="outline-primary" size="sm" onClick={handleAddInterest}>
                  Add Interest
                </Button>
              )}
            </Card.Header>
            <Card.Body>
              {isEditing ? (
                <ul className="list-unstyled">
                  {editUser.interests.map((interest) => (
                    <li key={interest.id} className="mb-2 d-flex gap-2">
                      <Form.Control
                        type="text"
                        value={interest.value}
                        onChange={(
                          e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
                        ) => handleInterestsChange(e, interest.id)}
                      />
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleRemoveInterest(interest.id)}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="list-unstyled">
                  {editUser.interests.map((interest) => (
                    <li key={interest.id}>{interest.value}</li>
                  ))}
                </ul>
              )}
            </Card.Body>
          </Card>

          {/* Courses Section */}
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Courses</h5>
              {isEditing && (
                <Button variant="outline-primary" size="sm" onClick={handleAddCourse}>
                  Add Course
                </Button>
              )}
            </Card.Header>
            <Card.Body>
              {isEditing ? (
                <ul className="list-unstyled">
                  {editUser.courses.map((course) => (
                    <li key={course.id} className="mb-2 d-flex gap-2">
                      <Form.Control
                        type="text"
                        value={course.value}
                        onChange={(
                          e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
                        ) => handleCoursesChange(e, course.id)}
                      />
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleRemoveCourse(course.id)}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="list-unstyled">
                  {editUser.courses.map((course) => (
                    <li key={course.id}>{course.value}</li>
                  ))}
                </ul>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Friend Activity Feed */}
        <Col md={4}>
          <Card className="sticky-top" style={{ top: '1rem' }}>
            <Card.Header>
              <h5 className="mb-0">Friend Activity</h5>
            </Card.Header>
            <Card.Body style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
              {activities.length === 0 ? (
                <p className="text-muted">No friends currently studying</p>
              ) : (
                activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="border-bottom pb-3 mb-3"
                  >
                    <div className="d-flex align-items-start gap-2">
                      <div className="rounded-circle bg-secondary" style={{ width: 40, height: 40 }} />
                      <div>
                        <p className="mb-1 fw-medium">
                          {activity.user.email.split('@')[0]}
                        </p>
                        <div className="d-flex align-items-center text-muted small">
                          <MapPin size={14} className="me-1" />
                          <span>{activity.spot.name}</span>
                        </div>
                        <div className="d-flex align-items-center text-muted small mt-1">
                          <Clock size={14} className="me-1" />
                          <span>
                            {formatDuration(activity.createdAt)}
                            ago
                          </span>
                        </div>
                        <div className="mt-2 text-muted small">
                          {activity.spot.hasOutlets && (
                            <p className="mb-1">🔌 Power outlets available</p>
                          )}
                          {activity.spot.hasFoodDrinks && (
                            <p className="mb-1">☕️ Food & drinks available</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
