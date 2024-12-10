'use client';

import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Container, Image, Nav, Navbar, NavDropdown, Form, Button } from 'react-bootstrap';
import { BoxArrowRight, PersonFill, PersonPlusFill, Search } from 'react-bootstrap-icons';
import { ComponentIDs } from '@/utilities/ids';

const NavBar: React.FC = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const currentUser = session?.user?.email;
  const menuStyle = { marginBottom: '0px' };
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <Navbar expand="lg" style={menuStyle}>
      <Container>
        <Navbar.Brand href="/" className="align-items-center">
          <span style={{ fontWeight: 800, fontSize: '24px' }}>
            <Image src="/images/logo.png" width={50} style={{ marginBottom: 3 }} alt="spots" />
            spots
          </span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls={ComponentIDs.basicNavbarNav} />
        <Navbar.Collapse id={ComponentIDs.basicNavbarNav}>

          {/* Search Bar */}
          <Form className="d-flex mx-auto" onSubmit={handleSearch}>
            <Form.Control
              type="search"
              placeholder="Search spots..."
              className="me-2"
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '400px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              }}
            />
            <Button
              className="btn-primary"
              type="submit"
            >
              <Search />
            </Button>
          </Form>

          {/* Menu Items */}
          <Nav className="me-auto justify-content-start">
            {currentUser && (
            <>
              <Nav.Link
                id={ComponentIDs.homeMenuItem}
                active={pathname === '/home'}
                href="/home"
              >
                home
              </Nav.Link>
              <Nav.Link
                id={ComponentIDs.addSpotMenuItem}
                active={pathname === '/add'}
                href="/add"
              >
                add spot
              </Nav.Link>
              <Nav.Link
                id={ComponentIDs.homeMenuItem}
                active={pathname === '/favorites'}
                href="/favorites"
                key="favorites"
              >
                favorites
              </Nav.Link>
              <Nav.Link
                id={ComponentIDs.projectsMenuItem}
                active={pathname === '/profile'}
                href="/profile"
                key="profile"
              >
                profile
              </Nav.Link>
            </>
            )}
          </Nav>

          {/* Dropdowns */}
          <Nav className="justify-content-end">
            {currentUser ? (
              <NavDropdown id={ComponentIDs.currentUserDropdown} title={currentUser}>
                <NavDropdown.Item id={ComponentIDs.currentUserDropdownSignOut} href="/auth/signout">
                  <BoxArrowRight />
                  Sign out
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown id={ComponentIDs.loginDropdown} title="Login">
                <NavDropdown.Item id={ComponentIDs.loginDropdownSignIn} href="/auth/signin">
                  <PersonFill />
                  Sign in
                </NavDropdown.Item>
                <NavDropdown.Item id={ComponentIDs.loginDropdownSignUp} href="/auth/signup">
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
