'use client';

import { useEffect, useState } from 'react';

const ProfilePage = () => {
  const [profile, setProfile] = useState<any>(null); // We'll use `any` to handle the profile data for simplicity
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile'); // API route to fetch profile data
        if (!response.ok) {
          throw new Error('Profile Not Found :(');
        }
        const data = await response.json();
        setProfile(data);
      } catch (fetchError: any) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        Error:
        {error}
      </div>
    );
  }

  if (!profile) {
    return <div>No profile found</div>;
  }

  return (
    <div className="container">
      {/* Profile Header */}
      <div className="profile-header">
        <h1>
          {profile.firstName}
          {' '}
          {profile.lastName}
        </h1>
        <p>
          <strong>Email:</strong>
          {' '}
          {profile.email}
        </p>
        <p>
          <strong>Bio:</strong>
          {' '}
          {profile.bio}
        </p>
      </div>

      {/* Additional Profile Information (Interests, Courses, etc.) */}
      <div className="profile-info">
        <h2>Interests</h2>
        <ul>
          {profile.interests?.map((interest: string) => (
            <li key={interest}>{interest}</li>
          ))}
        </ul>
        <h2>Courses</h2>
        <ul>
          {profile.courses?.map((course: string) => (
            <li key={course}>{course}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProfilePage;
