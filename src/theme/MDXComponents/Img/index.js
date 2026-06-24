import React from 'react';
import Head from '@docusaurus/Head';
import OriginalImg from '@theme-original/MDXComponents/Img';

const FIRST_MANUAL_PAGE_IMAGE_RE = /(^|\/)page-0?1(?:-[a-f0-9]+)?\.webp(?:\?.*)?$/i;

function isFirstManualPageImage(src) {
  return typeof src === 'string' && FIRST_MANUAL_PAGE_IMAGE_RE.test(src);
}

export default function MDXImg(props) {
  if (!isFirstManualPageImage(props.src)) {
    return <OriginalImg {...props} />;
  }

  return (
    <>
      <Head>
        <link rel="preload" as="image" href={props.src} fetchPriority="high" />
      </Head>
      <OriginalImg {...props} loading="eager" fetchPriority="high" />
    </>
  );
}
