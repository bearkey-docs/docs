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
};

function getLocaleConfig(locale) {
  if (locale === 'en') {
    return {
      lang: 'en',
      labels: {
        title: 'Comments',
        helper:
          'Sign in with GitHub to join the discussion or leave documentation feedback.',
        setup:
          'Comments are not configured yet. Enable GitHub Discussions and set GISCUS_CATEGORY / GISCUS_CATEGORY_ID to show localized comments.',
      },
    };
  }

  return {
    lang: 'zh-CN',
    labels: {
      title: '评论',
      helper: '使用 GitHub 登录后即可参与讨论或反馈文档问题。',
      setup:
        '评论功能尚未完成配置。请启用 GitHub Discussions，并设置 GISCUS_CATEGORY / GISCUS_CATEGORY_ID 后显示中文评论框。',
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

function getGiscusTheme(colorMode, baseUrl) {
  const themeName = colorMode === 'dark' ? 'dark' : 'light';
  const normalizedBaseUrl = (baseUrl || '/').replace(/\/$/, '');
  const themePath = `${normalizedBaseUrl}/giscus-blue-${themeName}.css`;

  return new URL(themePath, window.location.origin).href;
}

function appendGiscus(container, giscusConfig, colorMode, lang, baseUrl) {
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
    'data-theme': getGiscusTheme(colorMode, baseUrl),
    'data-lang': lang,
    'data-loading': 'lazy',
    crossorigin: 'anonymous',
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
        siteConfig.baseUrl,
      );
    } else {
      const setupMessage = document.createElement('p');
      setupMessage.className = 'doc-page-comments-setup';
      setupMessage.textContent = labels.setup;
      container.appendChild(setupMessage);
    }

    return () => {
      container.replaceChildren();
    };
  }, [
    colorMode,
    i18n.currentLocale,
    labels.setup,
    localeConfig.lang,
    siteConfig.customFields,
  ]);

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
