import React, {useEffect} from 'react';
import {useLocation} from '@docusaurus/router';
import {ENGLISH_DOC_PATHS} from '../generated/englishDocPaths';

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

const ENGLISH_DOC_PATH_SET = new Set(ENGLISH_DOC_PATHS);

function getEnglishDocPath(pathname) {
  const match = pathname.match(/(?:^|\/)en\/docs\/(.+?)\/?$/);

  if (!match) {
    return undefined;
  }

  return decodeURIComponent(match[1]).replace(/\/$/, '');
}

function isMissingEnglishDocLink(link) {
  const englishDocPath = getEnglishDocPath(new URL(link.href).pathname);

  return Boolean(englishDocPath && !ENGLISH_DOC_PATH_SET.has(englishDocPath));
}


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



function syncCategoryExpandedState(category, expanded) {
  category.classList.toggle('menu__list-item--collapsed', !expanded);

  const directList = category.querySelector(':scope > .menu__list');
  if (directList) {
    directList.style.display = expanded ? '' : 'none';
  }

  const directToggle = category.querySelector(
    ':scope > .menu__list-item-collapsible [aria-expanded]',
  );
  directToggle?.setAttribute('aria-expanded', String(expanded));
}

function resetAllDocsSidebarState() {
  const categories = document.querySelectorAll(
    '.theme-doc-sidebar-menu .theme-doc-sidebar-item-category',
  );

  categories.forEach((category) => {
    syncCategoryExpandedState(
      category,
      Boolean(category.querySelector('.menu__link--active')),
    );
  });
}


function clearAllDocsSidebarResetState() {
  const lists = document.querySelectorAll(
    '.theme-doc-sidebar-menu .theme-doc-sidebar-item-category > .menu__list',
  );

  lists.forEach((list) => list.style.removeProperty('display'));
}

function scheduleAllDocsSidebarReset() {
  window.setTimeout(resetAllDocsSidebarState, 0);
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
    const docsSection = getDocsSection(location.pathname, location.search);
    document.documentElement.dataset.docsSection = docsSection;

    if (docsSection === 'all') {
      scheduleAllDocsSidebarReset();
    } else {
      clearAllDocsSidebarResetState();
    }
  }, [location.pathname, location.search]);

  useEffect(() => {
    const handleClick = (event) => {
      if (!(event.target instanceof Element)) {
        return;
      }

      const link = event.target.closest('a[href*="/docs/"]');

      if (link && isMissingEnglishDocLink(link)) {
        event.preventDefault();
        window.location.reload();
        return;
      }

      const sectionItem = getTopLevelSectionItem(event.target);
      const section = getValidSection(getSectionFromSidebarItem(event.target));
      const linkSection = link
        ? new URL(link.href).searchParams.get('section')
        : undefined;

      if (linkSection === 'all') {
        scheduleAllDocsSidebarReset();
      }

      if (link && section && isTopLevelSectionLink(event.target, sectionItem)) {
        clearSectionQueryForCurrentPage(link);
        clearAllDocsSidebarResetState();
        document.documentElement.dataset.docsSection = section;
      }

      if (link && section && SHARED_SECTIONS.has(section)) {
        window.sessionStorage.setItem('docsSectionOverride', section);
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  return <>{children}</>;
}
