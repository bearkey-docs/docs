import React from 'react';
import {useLocation} from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useDoc} from '@docusaurus/plugin-content-docs/client';

const ISSUE_URL =
  'https://github.com/CacheBiomancerClash/document-web-design/issues/new';

function ReportIcon() {
  return (
    <svg viewBox="0 0 16 16" focusable="false" aria-hidden="true">
      <path
        fill="currentColor"
        d="M4.4 1.4 5.5 2.5h5l1.1-1.1.9.9-1 1A5.4 5.4 0 0 1 13 7v1h1.5v1.3H13v.2a5 5 0 0 1-.3 1.7l1.4 1.4-.9.9-1.2-1.2A5.4 5.4 0 0 1 8 14a5.4 5.4 0 0 1-4-1.7l-1.2 1.2-.9-.9 1.4-1.4A5 5 0 0 1 3 9.5v-.2H1.5V8H3V7a5.4 5.4 0 0 1 1.5-3.7l-1-1 .9-.9ZM8 3.8A4 4 0 0 0 4.3 8v1.5A3.8 3.8 0 0 0 8 12.7a3.8 3.8 0 0 0 3.7-3.2V8A4 4 0 0 0 8 3.8Zm-2 3h1.2v1.4H6V6.8Zm2.8 0H10v1.4H8.8V6.8Z"
      />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 16 16" focusable="false" aria-hidden="true">
      <path
        fill="currentColor"
        d="M11.9 1.6a1.9 1.9 0 0 1 2.7 2.7L5.4 13.5 1.8 14l.5-3.6 9.6-8.8Zm-.8 2.4L3.6 11.5l-.2 1 1-.2 7.5-7.5-.8-.8Zm1.7-1.6-.8.8.8.8.8-.8a.6.6 0 0 0-.8-.8Z"
      />
    </svg>
  );
}

function getLabels(locale) {
  if (locale === 'en') {
    return {
      report: 'Report Issue',
      edit: 'Edit this page',
    };
  }

  return {
    report: '反馈问题',
    edit: '编辑此页',
  };
}

function getCurrentPageUrl(siteConfig, location) {
  return new URL(
    `${location.pathname}${location.search}${location.hash}`,
    siteConfig.url,
  ).toString();
}

function getIssueUrl(title, pageUrl) {
  const issueUrl = new URL(ISSUE_URL);

  issueUrl.searchParams.set('title', `[Docs] ${title}`);
  issueUrl.searchParams.set(
    'body',
    `## 页面\n\n${pageUrl}\n\n## 问题描述\n\n`,
  );

  return issueUrl.toString();
}

export default function DocPageActions() {
  const {metadata} = useDoc();
  const {siteConfig, i18n} = useDocusaurusContext();
  const location = useLocation();
  const labels = getLabels(i18n.currentLocale);
  const pageUrl = getCurrentPageUrl(siteConfig, location);

  return (
    <div className="doc-page-actions">
      <a
        className="doc-page-action-link"
        href={getIssueUrl(metadata.title, pageUrl)}
        target="_blank"
        rel="noreferrer">
        <span className="doc-page-action-icon" aria-hidden="true">
          <ReportIcon />
        </span>
        {labels.report}
      </a>
      {metadata.editUrl && (
        <a
          className="doc-page-action-link"
          href={metadata.editUrl}
          target="_blank"
          rel="noreferrer">
          <span className="doc-page-action-icon" aria-hidden="true">
            <EditIcon />
          </span>
          {labels.edit}
        </a>
      )}
    </div>
  );
}
