import React, {useEffect, useRef} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useColorMode} from '@docusaurus/theme-common';

const COMMENTS_REPO = 'CacheBiomancerClash/document-web-design';
const GISCUS_REPO_ID = 'R_kgDOS9NXKw';

const DEFAULT_COMMENTS_CONFIG = {
  giscus: {
    repo: COMMENTS_REPO,
    repoId: GISCUS_REPO_ID,
    category: '',
    categoryId: '',
  },
  utterances: {
    repo: COMMENTS_REPO,
    issueTerm: 'pathname',
    label: 'docs-comment',
  },
};

function getLocaleConfig(locale) {
  if (locale === 'en') {
    return {
      lang: 'en',
      labels: {
        title: 'Comments',
        helper:
          'Sign in with GitHub to join the discussion or leave documentation feedback.',
      },
    };
  }

  return {
    lang: 'zh-CN',
    labels: {
      title: '评论',
      helper: '使用 GitHub 登录后即可参与讨论或反馈文档问题。',
    },
  };
}

function getCommentsConfig(customFields) {
  const commentsConfig = customFields?.comments || {};

  return {
    giscus: {
      ...DEFAULT_COMMENTS_CONFIG.giscus,
      ...(commentsConfig.giscus || {}),
    },
    utterances: {
      ...DEFAULT_COMMENTS_CONFIG.utterances,
      ...(commentsConfig.utterances || {}),
    },
  };
}

function hasGiscusConfig(giscusConfig) {
  return Boolean(
    giscusConfig.repo &&
      giscusConfig.repoId &&
      giscusConfig.category &&
      giscusConfig.categoryId,
  );
}

function appendScript(container, src, attributes) {
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  script.crossOrigin = 'anonymous';

  Object.entries(attributes).forEach(([name, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      script.setAttribute(name, value);
    }
  });

  container.appendChild(script);
}

function appendGiscus(container, giscusConfig, colorMode, lang) {
  appendScript(container, 'https://giscus.app/client.js', {
    'data-repo': giscusConfig.repo,
    'data-repo-id': giscusConfig.repoId,
    'data-category': giscusConfig.category,
    'data-category-id': giscusConfig.categoryId,
    'data-mapping': 'pathname',
    'data-strict': '0',
    'data-reactions-enabled': '1',
    'data-emit-metadata': '0',
    'data-input-position': 'bottom',
    'data-theme': colorMode === 'dark' ? 'dark' : 'light',
    'data-lang': lang,
    'data-loading': 'lazy',
    crossorigin: 'anonymous',
  });
}

function appendUtterances(container, utterancesConfig, colorMode, lang) {
  appendScript(container, 'https://utteranc.es/client.js', {
    repo: utterancesConfig.repo,
    'issue-term': utterancesConfig.issueTerm,
    label: utterancesConfig.label,
    theme: colorMode === 'dark' ? 'github-dark' : 'github-light',
    lang,
  });
}

export default function DocPageComments() {
  const containerRef = useRef(null);
  const {colorMode} = useColorMode();
  const {i18n, siteConfig} = useDocusaurusContext();
  const localeConfig = getLocaleConfig(i18n.currentLocale);
  const labels = localeConfig.labels;

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return undefined;
    }

    container.replaceChildren();

    const commentsConfig = getCommentsConfig(siteConfig.customFields);

    if (hasGiscusConfig(commentsConfig.giscus)) {
      appendGiscus(
        container,
        commentsConfig.giscus,
        colorMode,
        localeConfig.lang,
      );
    } else {
      appendUtterances(
        container,
        commentsConfig.utterances,
        colorMode,
        localeConfig.lang,
      );
    }

    return () => {
      container.replaceChildren();
    };
  }, [colorMode, i18n.currentLocale, localeConfig.lang, siteConfig.customFields]);

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
