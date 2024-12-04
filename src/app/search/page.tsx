import { Suspense } from 'react';
import SearchContent from '@/components/SearchContent';

const SearchPage: React.FC = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <SearchContent />
  </Suspense>
);

export default SearchPage;
