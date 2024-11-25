/* eslint-disable react/jsx-indent, @typescript-eslint/indent */

'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import {
  BoxArrowRight,
  Lock,
  PersonFill,
  PersonPlusFill,
} from 'react-bootstrap-icons';

const NavBar: React.FC = () => {
  const { data: session } = useSession();
  const currentUser = session?.user?.email;
  const userWithRole = session?.user as { email: string; randomKey: string };
  const role = userWithRole?.randomKey;
  const pathName = usePathname();

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="/">SPOTS</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Always visible links */}
            <Nav.Link
              id="map-nav"
              href="/map"
              key="map"
              active={pathName === '/map'}
            >
              Map
            </Nav.Link>
            <Nav.Link
              id="favorites-nav"
              href="/favorites"
              key="favorites"
              active={pathName === '/favorites'}
            >
              Favorites
            </Nav.Link>

            {/* Links visible only to logged-in users */}
            {currentUser && (
              <Nav.Link
                id="profile-nav"
                href="/profile"
                key="profile"
                active={pathName === '/profile'}
              >
                  Profile
              </Nav.Link>
            )}
            {/* Admin-specific link */}
            {currentUser && role === 'ADMIN' && (
              <Nav.Link
                id="admin-nav"
                href="/admin"
                key="admin"
                active={pathName === '/admin'}
              >
                Admin
              </Nav.Link>
            )}
          </Nav>
          <Nav>
            {/* Authentication dropdown */}
            {session ? (
              <NavDropdown id="user-dropdown" title={currentUser}>
                <NavDropdown.Item
                  id="user-signout"
                  href="/api/auth/signout"
                >
                  <BoxArrowRight />
                  Sign Out
                </NavDropdown.Item>
                <NavDropdown.Item
                  id="user-change-password"
                  href="/auth/change-password"
                >
                  <Lock />
                  Change Password
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown id="guest-dropdown" title="Login">
                <NavDropdown.Item
                  id="guest-signin"
                  href="/auth/signin"
                >
                  <PersonFill />
                  Sign in
                </NavDropdown.Item>
                <NavDropdown.Item
                  id="guest-signup"
                  href="/auth/signup"
                >
                  <PersonPlusFill />
                  Sign up
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
