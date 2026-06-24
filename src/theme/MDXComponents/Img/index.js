import React from 'react';
import Head from '@docusaurus/Head';
import OriginalImg from '@theme-original/MDXComponents/Img';

const MANUAL_PAGE_IMAGE_RE = /(^|\/)page-(\d+)(?:-[a-f0-9]+)?\.webp(?:\?.*)?$/i;
const HIGH_PRIORITY_PAGE_COUNT = 3;

function getManualPageNumber(src) {
  const match = typeof src === 'string' ? src.match(MANUAL_PAGE_IMAGE_RE) : null;

  return match ? Number(match[2]) : undefined;
}

export default function MDXImg(props) {
  const manualPageNumber = getManualPageNumber(props.src);

  if (!manualPageNumber) {
    return <OriginalImg {...props} />;
  }

  const isHighPriority = manualPageNumber <= HIGH_PRIORITY_PAGE_COUNT;

  return (
    <>
      {isHighPriority && (
        <Head>
          <link rel="preload" as="image" href={props.src} fetchPriority="high" />
        </Head>
      )}
      <OriginalImg
        {...props}
        loading="eager"
        fetchPriority={isHighPriority ? 'high' : undefined}
      />
    </>
  );
}
