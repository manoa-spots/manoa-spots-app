'use client';

import { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { Clock, MapPin } from 'lucide-react';

interface User {
  id: string;
  email: string;
}

interface Spot {
  id: string;
  name: string;
  address: string;
  hasOutlets: boolean;
  hasFoodDrinks: boolean;
}

interface Activity {
  id: string;
  user: User;
  spot: Spot;
  createdAt: string;
}

interface FriendActivityProps {
  userId: string;
}

const FriendActivity = ({ userId }: FriendActivityProps) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriendsActivity = async () => {
      try {
        const res = await fetch(`/api/friends/activity/${userId}`);
        const data = await res.json();
        setActivities(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching friends activity:', error);
        setLoading(false);
      }
    };

    fetchFriendsActivity();
    // Poll for updates every minute
    const interval = setInterval(fetchFriendsActivity, 60000);
    return () => clearInterval(interval);
  }, [userId]);

  const formatDuration = (startTime: string): string => {
    const start = new Date(startTime);
    const now = new Date();
    const diff = Math.floor((now.getTime() - start.getTime()) / 1000 / 60); // minutes
    if (diff < 60) return `${diff}m`;
    const hours = Math.floor(diff / 60);
    return `${hours}h ${diff % 60}m`;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="sticky-top" style={{ top: '1rem' }}>
      <Card.Header>
        <h5 className="mb-0">Friend Activity</h5>
      </Card.Header>
      <Card.Body style={{ maxHeight: 'calc(100vh-200px)', overflowY: 'auto' }}>
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
                    <p className="mb-1">
                      📍
                      {activity.spot.address}
                    </p>
                    {activity.spot.hasOutlets && <p className="mb-1">🔌 Power outlets available</p>}
                    {activity.spot.hasFoodDrinks && <p className="mb-1">☕️ Food & drinks available</p>}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </Card.Body>
    </Card>
  );
};

export default FriendActivity;
