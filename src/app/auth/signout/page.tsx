'use client';

import { signOut } from 'next-auth/react';
import { Button, Container } from 'react-bootstrap';

const SignOutPage: React.FC = () => {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' }); // Redirect to homepage after signing out
  };

  return (
    <Container
      className="d-flex flex-column align-items-center justify-content-center vh-100 text-center"
    >
      <p style={{ fontSize: '1.25rem', fontWeight: '500', marginBottom: '1rem' }}>
        Are you sure you want to sign out?
      </p>
      <Button
        onClick={handleSignOut}
        className="custom-button"
        style={{
          backgroundColor: 'var(--primary-dark)',
          color: 'var(--primary-light)',
          border: '1px solid var(--primary-dark)',
          borderRadius: '5px',
          padding: '0.5rem 1.5rem',
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        Sign Out
      </Button>
    </Container>
  );
};

export default SignOutPage;
