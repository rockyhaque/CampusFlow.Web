import { PageSpinner } from './Spinner.jsx';
import { pageContent } from '../../components/layout/layoutClasses.js';

/** Shown while a lazy-loaded route chunk is downloading. */
export default function RouteFallback() {
  return (
    <div className={pageContent} aria-busy="true" aria-label="Loading page">
      <PageSpinner />
    </div>
  );
}
