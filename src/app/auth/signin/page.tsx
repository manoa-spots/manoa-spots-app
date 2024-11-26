'use client';

import { signIn } from 'next-auth/react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';

/** The sign in page. */
const SignIn = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };
    const email = target.email.value;
    const password = target.password.value;
    const result = await signIn('credentials', {
      callbackUrl: '/home',
      email,
      password,
    });

    if (result?.error) {
      console.error('Sign in failed: ', result.error);
    }
  };

  return (
    <main className="d-flex vh-100">
      {/* Left Section */}
      <Container fluid className="d-flex align-items-center justify-content-center flex-column w-50 bg-white">
        <Row className="w-100 justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <div className="text-center mb-4">
              <h1 className="fw-bold">Welcome Back!</h1>
            </div>
            <Card className="border-0 shadow p-4">
              <Card.Body>
                <Form method="post" onSubmit={handleSubmit}>
                  <Form.Group controlId="formBasicEmail" className="mb-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      name="email"
                      type="email"
                      placeholder="Email address"
                    />
                  </Form.Group>
                  <Form.Group controlId="formBasicPassword" className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      name="password"
                      type="password"
                      placeholder="Password"
                    />
                  </Form.Group>
                  <Button
                    type="submit"
                    className="w-100 mt-3 custom-button"
                    style={{
                      backgroundColor: 'var(--navbar-bg-color)',
                      color: 'var(--navbar-text-color)',
                      border: '1px solid var(--navbar-text-color)',
                      borderRadius: '5px',
                      padding: '0.5rem 1rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    Sign In
                  </Button>
                </Form>
              </Card.Body>
            </Card>
            <div className="text-center mt-4">
              <p>
                Don&apos;t Have An Account?
                {' '}
                <a href="/auth/signup">Sign Up For Spots!</a>
              </p>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Right Section */}
      <div
        className="w-50 d-none d-md-block"
        style={{
          backgroundImage: "url('/images/background.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

    </main>
  );
};

export default SignIn;
