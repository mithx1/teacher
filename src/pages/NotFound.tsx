import { Link } from 'react-router';
import { PageHeading, usePageTitle } from '../components/common';

export function NotFound() {
  usePageTitle('Not found');
  return (
    <>
      <PageHeading>Page not found</PageHeading>
      <p>
        <Link to="/">Go to the start page</Link>
      </p>
    </>
  );
}
