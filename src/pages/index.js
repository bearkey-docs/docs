import React from 'react';
import {Redirect} from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function Home() {
  return <Redirect to={useBaseUrl('/docs/core-board/rk3588-core-board/product-specification?section=all')} />;
}
