import React from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import OriginalImg from '@theme-original/MDXComponents/Img';

const MANUAL_PAGE_IMAGE_RE = /(^|\/)page-(\d+)(?:-[a-f0-9]+)?\.webp(?:\?.*)?$/i;
const HIGH_PRIORITY_PAGE_COUNT = 3;

function getManualPageNumber(src) {
  const match = typeof src === 'string' ? src.match(MANUAL_PAGE_IMAGE_RE) : null;

  return match ? Number(match[2]) : undefined;
}

function getManualImageSrc(src, cdnBase) {
  if (!cdnBase || typeof src !== 'string' || !src.startsWith('/assets/images/')) {
    return src;
  }

  return `${cdnBase.replace(/\/$/, '')}${src}`;
}

export default function MDXImg(props) {
  const {
    siteConfig: {customFields},
  } = useDocusaurusContext();
  const manualPageNumber = getManualPageNumber(props.src);

  if (!manualPageNumber) {
    return <OriginalImg {...props} />;
  }

  const src = getManualImageSrc(props.src, customFields.manualImageCdnBase);
  const isHighPriority = manualPageNumber <= HIGH_PRIORITY_PAGE_COUNT;

  if (!isHighPriority) {
    return <OriginalImg {...props} src={src} />;
  }

  return (
    <>
      <Head>
        <link rel="preload" as="image" href={src} fetchPriority="high" />
      </Head>
      <OriginalImg {...props} src={src} loading="eager" fetchPriority="high" />
    </>
  );
}
