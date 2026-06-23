import React, {useEffect} from 'react';
import {useLocation} from '@docusaurus/router';

const DOCS_SECTIONS = new Set([
  'core-board',
  'main-board',
  'terminal',
  'aiot-solutions',
  'openharmony',
  'mineharmony',
  'reference',
]);

function getDocsSection(pathname) {
  const match = pathname.match(/(?:^|\/)docs(?:\/([^/]+))?/);
  const section = match?.[1];

  if (!section || section === 'intro') {
    return 'all';
  }

  return DOCS_SECTIONS.has(section) ? section : 'all';
}

export default function Root({children}) {
  const location = useLocation();

  useEffect(() => {
    document.documentElement.dataset.docsSection = getDocsSection(
      location.pathname,
    );
  }, [location.pathname]);

  return <>{children}</>;
}
