import { Container } from 'react-bootstrap';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import FavoriteContent from '@/components/FavoriteContent';

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id || '';

  if (!currentUserId) {
    return (
      <main>
        <div className="py-5 text-center">
          <h2>You need to log in to view your favorites!</h2>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="landing-hero">
        <Container className="text-center landing-hero">
          <h1 style={{ fontSize: '36pt', fontWeight: '600', color: 'var(--primary-dark)' }}>
            Your Favorite Spots
          </h1>
        </Container>
      </div>
      <FavoriteContent userId={currentUserId} />
    </main>
  );
}
