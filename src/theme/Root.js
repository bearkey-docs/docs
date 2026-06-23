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

const SHARED_SECTIONS = new Set([
  'aiot-solutions',
  'openharmony',
  'mineharmony',
]);

function getValidSection(section) {
  return section === 'all' || DOCS_SECTIONS.has(section) ? section : undefined;
}

function getDocsSection(pathname, search) {
  const querySection = getValidSection(new URLSearchParams(search).get('section'));

  if (querySection) {
    return querySection;
  }

  const storedSection = getValidSection(
    window.sessionStorage.getItem('docsSectionOverride'),
  );

  if (storedSection) {
    window.sessionStorage.removeItem('docsSectionOverride');
    return storedSection;
  }

  const match = pathname.match(/(?:^|\/)docs(?:\/([^/]+))?/);
  const section = match?.[1];

  if (!section || section === 'intro') {
    return 'all';
  }

  return getValidSection(section) ?? 'all';
}


function getTopLevelSectionItem(element) {
  return element.closest('.sidebar-section-top');
}

function isTopLevelSectionLink(element, sectionItem) {
  const link = element.closest('a');
  const collapsible = link?.closest('.menu__list-item-collapsible');

  return Boolean(
    link &&
      sectionItem &&
      collapsible &&
      collapsible.parentElement === sectionItem,
  );
}


function clearSectionQueryForCurrentPage(link) {
  const currentUrl = new URL(window.location.href);
  const linkUrl = new URL(link.href);

  if (
    currentUrl.pathname === linkUrl.pathname &&
    currentUrl.searchParams.has('section')
  ) {
    currentUrl.searchParams.delete('section');
    window.history.replaceState(
      window.history.state,
      '',
      `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`,
    );
  }
}

function getSectionFromSidebarItem(element) {
  const sectionItem = element.closest('.sidebar-section-top');
  const sectionClass = Array.from(sectionItem?.classList ?? []).find((className) =>
    className.startsWith('sidebar-section-') && className !== 'sidebar-section-top',
  );

  return sectionClass?.replace('sidebar-section-', '');
}

export default function Root({children}) {
  const location = useLocation();

  useEffect(() => {
    document.documentElement.dataset.docsSection = getDocsSection(
      location.pathname,
      location.search,
    );
  }, [location.pathname, location.search]);

  useEffect(() => {
    const handleClick = (event) => {
      if (!(event.target instanceof Element)) {
        return;
      }

      const link = event.target.closest('a[href*="/docs/"]');
      const sectionItem = getTopLevelSectionItem(event.target);
      const section = getValidSection(getSectionFromSidebarItem(event.target));

      if (link && section && isTopLevelSectionLink(event.target, sectionItem)) {
        clearSectionQueryForCurrentPage(link);
        document.documentElement.dataset.docsSection = section;
      }

      if (link && section && SHARED_SECTIONS.has(section)) {
        window.sessionStorage.setItem('docsSectionOverride', section);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return <>{children}</>;
}
