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
const SIDEBAR_SYNC_DELAYS = [0, 50, 150, 350, 700, 1200, 2000];
let sidebarSyncRunId = 0;

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

function getDocsPathSection(pathname) {
  const match = pathname.match(/(?:^|\/)docs(?:\/([^/]+))?/);
  return getValidSection(match?.[1]);
}

function normalizePathname(pathname) {
  return decodeURIComponent(pathname).replace(/\/$/, '');
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

  const directToggle = category.querySelector(
    ':scope > .menu__list-item-collapsible [aria-expanded]',
  );
  directToggle?.setAttribute('aria-expanded', String(expanded));
}

function categoryContainsCurrentPage(category) {
  const currentPathname = normalizePathname(window.location.pathname);
  const links = category.querySelectorAll('a.menu__link[href]');

  return Array.from(links).some((link) => {
    const href = link.getAttribute('href');

    if (!href || href.startsWith('#')) {
      return false;
    }

    const linkPathname = normalizePathname(new URL(link.href).pathname);
    return linkPathname === currentPathname;
  });
}

function syncDocsSidebarState(docsSection) {
  const activePathSection = getDocsPathSection(window.location.pathname);
  const targetSection = docsSection === 'all' ? activePathSection : docsSection;
  const categories = document.querySelectorAll(
    '.theme-doc-sidebar-menu .theme-doc-sidebar-item-category',
  );

  categories.forEach((category) => {
    const sectionItem = category.closest('.sidebar-section-top');
    const isTargetSection =
      !targetSection ||
      sectionItem?.classList.contains(`sidebar-section-${targetSection}`);

    syncCategoryExpandedState(
      category,
      isTargetSection &&
        (Boolean(category.querySelector('.menu__link--active')) ||
          categoryContainsCurrentPage(category)),
    );
  });
}

function clearAllDocsSidebarResetState() {
  const categories = document.querySelectorAll(
    '.theme-doc-sidebar-menu .theme-doc-sidebar-item-category.menu__list-item--collapsed',
  );

  categories.forEach((category) => {
    category.classList.remove('menu__list-item--collapsed');
    const directToggle = category.querySelector(
      ':scope > .menu__list-item-collapsible [aria-expanded]',
    );
    directToggle?.setAttribute('aria-expanded', 'true');
  });
}

function scheduleDocsSidebarStateSync(docsSection) {
  const runId = ++sidebarSyncRunId;
  let frame;
  let syncing = false;

  const sync = () => {
    if (runId !== sidebarSyncRunId || frame) {
      return;
    }

    frame = window.requestAnimationFrame(() => {
      frame = undefined;

      if (runId !== sidebarSyncRunId) {
        return;
      }

      syncing = true;
      syncDocsSidebarState(docsSection);
      syncing = false;
    });
  };

  const observer = new MutationObserver(() => {
    if (!syncing) {
      sync();
    }
  });
  const target =
    document.querySelector('.theme-doc-sidebar-menu') ?? document.body;

  observer.observe(target, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['class', 'style', 'aria-expanded'],
  });

  const timeouts = SIDEBAR_SYNC_DELAYS.map((delay) =>
    window.setTimeout(sync, delay),
  );
  const observerTimeout = window.setTimeout(() => observer.disconnect(), 2500);

  sync();

  return () => {
    sidebarSyncRunId += 1;
    observer.disconnect();
    window.clearTimeout(observerTimeout);
    timeouts.forEach((timeout) => window.clearTimeout(timeout));

    if (frame) {
      window.cancelAnimationFrame(frame);
    }
  };
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
      return scheduleDocsSidebarStateSync(docsSection);
    } else {
      clearAllDocsSidebarResetState();
      return scheduleDocsSidebarStateSync(docsSection);
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

      if (getValidSection(linkSection)) {
        scheduleDocsSidebarStateSync(linkSection);
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
