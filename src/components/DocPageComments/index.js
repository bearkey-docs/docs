import React, {useEffect, useRef} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useColorMode} from '@docusaurus/theme-common';

const COMMENTS_REPO = 'CacheBiomancerClash/document-web-design';

function getLabels(locale) {
  if (locale === 'en') {
    return {
      title: 'Comments',
      helper:
        'Sign in with GitHub to join the discussion or leave documentation feedback.',
    };
  }

  return {
    title: '评论',
    helper: '使用 GitHub 登录后即可参与讨论或反馈文档问题。',
  };
}

export default function DocPageComments() {
  const containerRef = useRef(null);
  const {colorMode} = useColorMode();
  const {i18n} = useDocusaurusContext();
  const labels = getLabels(i18n.currentLocale);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return undefined;
    }

    container.replaceChildren();

    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('repo', COMMENTS_REPO);
    script.setAttribute('issue-term', 'pathname');
    script.setAttribute('label', 'docs-comment');
    script.setAttribute(
      'theme',
      colorMode === 'dark' ? 'github-dark' : 'github-light',
    );

    container.appendChild(script);

    return () => {
      container.replaceChildren();
    };
  }, [colorMode]);

  return (
    <section className="doc-page-comments" aria-labelledby="doc-comments-title">
      <h2 id="doc-comments-title" className="doc-page-comments-title">
        {labels.title}
      </h2>
      <p className="doc-page-comments-helper">{labels.helper}</p>
      <div ref={containerRef} className="doc-page-comments-frame" />
    </section>
  );
}
