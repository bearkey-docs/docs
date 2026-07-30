// @ts-check

const fs = require('fs');
const path = require('path');
const {hasEnglishDoc, isEnglishBuild} = require('./scripts/english-docs');
const lightCodeTheme = require('prism-react-renderer').themes.github;
const darkCodeTheme = require('prism-react-renderer').themes.dracula;
const splitDocSourceIds = new Set(require('./src/generated/splitDocSourceIds.json'));
const docsEditBaseUrl =
  'https://github.com/bearkey-docs/docs/edit/main/';
const splitDocSourcePaths = [...splitDocSourceIds].flatMap((id) => [
  `${id}.md`,
  `${id}.mdx`,
]);

function filterEnglishSidebarItems(items) {
  return items.flatMap((item) => {
    if (item.type === 'doc') {
      if (splitDocSourceIds.has(item.id)) {
        return [];
      }

      return hasEnglishDoc(item.id) ? [item] : [];
    }

    if (item.type !== 'category') {
      return [item];
    }

    const filteredItems = filterEnglishSidebarItems(item.items);
    const hasLocalizedLink =
      item.link != null &&
      (item.link.type !== 'doc' || hasEnglishDoc(item.link.id));

    if (filteredItems.length === 0 && !hasLocalizedLink) {
      return [];
    }

    if (!hasLocalizedLink) {
      const itemWithoutLink = {...item};
      delete itemWithoutLink.link;
      return [{ ...itemWithoutLink, items: filteredItems }];
    }

    return [{ ...item, items: filteredItems }];
  });
}

function applyReadmeCategoryLabels(items, docsById) {
  return items.map((item) => {
    if (item.type !== 'category') {
      return item;
    }

    const nestedItems = applyReadmeCategoryLabels(item.items, docsById);
    const readmeId =
      item.link?.type === 'doc' && item.link.id.endsWith('/README')
        ? item.link.id
        : item.items.find(
            (child) => child.type === 'doc' && child.id.endsWith('/README'),
          )?.id;
    const readmeLabel = docsById.get(readmeId)?.frontMatter?.sidebar_label;

    return {
      ...item,
      ...(readmeLabel ? {label: readmeLabel} : {}),
      items: nestedItems,
    };
  });
}

function filterHiddenSidebarItems(items, docsById) {
  const isHiddenDoc = (id) =>
    docsById.get(id)?.frontMatter?.hide_from_sidebar === true;

  return items.flatMap((item) => {
    if (item.type === 'doc') {
      return isHiddenDoc(item.id) ? [] : [item];
    }

    if (item.type === 'link') {
      return item.docId && isHiddenDoc(item.docId) ? [] : [item];
    }

    if (item.type !== 'category') {
      return [item];
    }

    const filteredItems = filterHiddenSidebarItems(item.items, docsById);
    const hasHiddenDocLink =
      item.link?.type === 'doc' && isHiddenDoc(item.link.id);

    if (hasHiddenDocLink && filteredItems.length === 0) {
      return [];
    }

    if (hasHiddenDocLink) {
      const itemWithoutLink = {...item, items: filteredItems};
      delete itemWithoutLink.link;
      return [itemWithoutLink];
    }

    return [{...item, items: filteredItems}];
  });
}

async function localizedSidebarItemsGenerator(args) {
  const items = await args.defaultSidebarItemsGenerator(args);
  const docsById = new Map(args.docs.map((doc) => [doc.id, doc]));
  const labeledItems = applyReadmeCategoryLabels(items, docsById);
  const visibleItems = filterHiddenSidebarItems(labeledItems, docsById);
  const filteredItems = removeTopLevelReadmeLinks(visibleItems);

  return isEnglishBuild() ? filterEnglishSidebarItems(filteredItems) : filteredItems;
}

const topLevelReadmeDocIds = new Set([
  'aiot-solutions/README',
  'core-board/README',
  'main-board/README',
  'mineharmony/README',
  'openharmony/README',
  'reference/README',
  'terminal/README',
]);

function removeTopLevelReadmeLinks(items) {
  return items.flatMap((item) => {
    if (item.type === 'doc' && splitDocSourceIds.has(item.id)) {
      return [];
    }

    if (item.type === 'doc' && topLevelReadmeDocIds.has(item.id)) {
      return [];
    }

    if (item.type === 'link' && topLevelReadmeDocIds.has(item.docId)) {
      return [];
    }

    if (item.type !== 'category') {
      return [item];
    }

    return [{...item, items: removeTopLevelReadmeLinks(item.items)}];
  });
}

const productNavGroups = [
  {
    label: '核心板',
    items: [
      'RK3588 核心板',
      'RK3568 工业级核心板',
      'RK3399 Pro 核心板',
      'TB-96AIoT-1808CO',
    ],
  },
  {
    label: '主板',
    items: [
      'RK3568鸿蒙主线开发板',
      'RK3568 工业控制主板',
      'RK3576 工业控制主板',
      'RK3588 工业主板',
      'RK3576 商业显示主板',
      'RK3588核心板+底板',
      'Robo3588机器人主板',
      'RK3506 工业主板',
      'Carrier Board',
    ],
  },
  {
    label: '终端',
    items: [
      'AI边缘工作站',
      'RK3576 数据采集网关',
      '8英寸平板',
      '10.6英寸平板',
      '11英寸平板',
      'RK3568 数据采集网关',
      'RK3568工控屏（10.1寸）',
      'RK3588 边缘控制网关',
      '工控屏',
      '拼接屏处理器',
      '视频优化盒子',
      'RK3588边缘计算工业网关',
      'RK3568工控屏（15.6寸）',
      'RK3506 工控屏（10.1寸）',
      'BQ8180 AI Mini PC',
    ],
  },
  {
    label: 'AIOT解决方案',
    items: [
      'AI边缘工作站',
      'RK3576 数据采集网关',
      '8英寸平板',
      '10.6英寸平板',
      '11英寸平板',
      'RK3568 数据采集网关',
      '工控屏',
      '拼接屏处理器',
    ],
  },
  {
    label: 'OpenHarmony',
    items: [
      'RK3568鸿蒙主线开发板',
      'RK3576 数据采集网关',
      'RK3568 工业控制主板',
      'RK3576 工业控制主板',
      '8英寸平板',
      '10.6英寸平板',
      '11英寸平板',
      'RK3568 数据采集网关',
      'RK3588工业主板',
      'RK3576 商业显示主板',
      '工控屏',
      'RK3588核心板+底板',
      '拼接屏处理器',
    ],
  },
  {
    label: 'MineHarmony',
    items: [
      'RK3568鸿蒙主线开发板',
      'RK3568 工业控制主板',
      'RK3576 工业控制主板',
      '8英寸平板',
      '11英寸平板',
      'RK3568 数据采集网关',
      'RK3588工业主板',
      '工控屏',
    ],
  },
];

const productDocLinks = {
  'RK3588 核心板': '/docs/core-board/rk3588-core-board',
  'RK3568 工业级核心板': '/docs/core-board/rk3568-industrial-core-board',
  'RK3399 Pro 核心板': '/docs/core-board/rk3399-pro-core-board',
  'TB-96AIoT-1808CO': '/docs/core-board/tb-96aiot-1808co',
  'RK3568 主板': '/docs/main-board/rk3568-main-board',
  'RK3568鸿蒙主线开发板': '/docs/main-board/rk3568-main-board',
  'RK3568 工业控制主板': '/docs/main-board/rk3568-industrial-control-main-board',
  'RK3576 工业控制主板': '/docs/main-board/rk3576-industrial-control-main-board',
  'RK3588 工业主板': '/docs/main-board/rk3588-industrial-main-board',
  'RK3588工业主板': '/docs/main-board/rk3588-industrial-main-board',
  'RK3576 商业显示主板': '/docs/main-board/rk3576-commercial-display-main-board',
  'RK3588 主板': '/docs/main-board/rk3588-main-board',
  'RK3588核心板+底板': '/docs/main-board/rk3588-main-board',
  'Robo3588机器人主板': '/docs/main-board/robo3588-robot-main-board',
  'RK3506 工业主板': '/docs/main-board/rk3506-industrial-main-board',
  'AI边缘工作站': '/docs/terminal/ai-edge-workstation',
  'RK3576 数据采集网关': '/docs/terminal/rk3576-data-acquisition-gateway',
  '8英寸平板': '/docs/terminal/eight-inch-tablet',
  '10.6英寸平板': '/docs/terminal/ten-six-inch-tablet',
  '11英寸平板': '/docs/terminal/eleven-inch-tablet',
  'RK3568 数据采集网关': '/docs/terminal/rk3568-data-acquisition-gateway',
  'RK3568工控屏': '/docs/terminal/rk3568-industrial-panel',
  'RK3568工控屏（10.1寸）': '/docs/terminal/rk3568-industrial-panel',
  'RK3588 边缘控制网关': '/docs/terminal/rk3588-edge-control-gateway',
  '工控屏': '/docs/terminal/industrial-panel',
  '拼接屏处理器': '/docs/terminal/video-wall-processor',
  '视频优化盒子': '/docs/terminal/video-optimization-box',
  'RK3588边缘计算工业网关': '/docs/terminal/rk3588-edge-computing-industrial-gateway',
  'RK3568-15.6英寸屏': '/docs/terminal/rk3568-15-6-inch-panel',
  'RK3568工控屏（15.6寸）': '/docs/terminal/rk3568-15-6-inch-panel',
  'RK3506 工控屏': '/docs/terminal/rk3506-industrial-panel',
  'RK3506 工控屏（10.1寸）': '/docs/terminal/rk3506-industrial-panel',
  'BQ8180 AI Mini PC': '/docs/terminal/bq8180-ai-mini-pc',
  'Carrier Board': '/docs/main-board/carrier-board',
};


const contextualProductGroups = {
  'AIOT解决方案': 'aiot-solutions',
  OpenHarmony: 'openharmony',
  MineHarmony: 'mineharmony',
};

// 每个顶部分类对应的分类首页（docs_cn/<category>/README.md 的 slug）。
const productNavGroupLinks = {
  '核心板': '/docs/core-board',
  '主板': '/docs/main-board',
  '终端': '/docs/terminal',
  'AIOT解决方案': '/docs/aiot-solutions',
  OpenHarmony: '/docs/openharmony',
  MineHarmony: '/docs/mineharmony',
};

const withSidebarContext = (to, section) =>
  section ? `${to}?section=${section}` : to;

const getSectionProductLink = (productLink, section) =>
  section
    ? productLink.replace(/^\/docs\/[^/]+/, `/docs/${section}`)
    : productLink;

const getProductNavbarItem = (label, section) =>
  productDocLinks[label]
    ? {
        label: getNavbarProductDisplayLabel(label, section),
        to: withSidebarContext(
          getSectionProductLink(productDocLinks[label], section),
          section,
        ),
        ...(label === 'RK3588 核心板'
          ? {activeBaseRegex: '^/docs/core-board/rk3588-core-board/?'}
          : {}),
      }
    : {
        label,
        href: '#',
      };

const getNavbarDocsRoot = () =>
  isEnglishBuild()
    ? path.join(
        __dirname,
        'docs_en',
        'en',
        'docusaurus-plugin-content-docs',
        'current',
      )
    : path.join(__dirname, 'docs_cn');

function getNavbarReadmeFrontMatter(...pathSegments) {
  const readmePath = path.join(getNavbarDocsRoot(), ...pathSegments, 'README.md');

  if (!fs.existsSync(readmePath)) {
    return '';
  }

  const source = fs.readFileSync(readmePath, 'utf8');
  return source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] || '';
}

function isNavbarReadmeHidden(...pathSegments) {
  return /^hide_from_sidebar:\s*true\s*$/m.test(
    getNavbarReadmeFrontMatter(...pathSegments),
  );
}

function getNavbarProductLocation(label, section) {
  const productLink = productDocLinks[label];
  const contextualProductLink = getSectionProductLink(productLink, section);
  const match = contextualProductLink?.match(/^\/docs\/([^/?#]+)\/([^/?#]+)/);

  return match ? {section: match[1], product: match[2]} : undefined;
}

function getNavbarProductDisplayLabel(label, section) {
  const location = getNavbarProductLocation(label, section);
  const frontMatter = location
    ? getNavbarReadmeFrontMatter(location.section, location.product)
    : '';
  const value = frontMatter
    .match(/^sidebar_label:\s*(.+?)\s*$/m)?.[1]
    ?.trim();

  if (!value) {
    return label;
  }

  const hasMatchingQuotes =
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"));
  return hasMatchingQuotes ? value.slice(1, -1) : value;
}

function isNavbarProductHidden(label, section) {
  const location = getNavbarProductLocation(label, section);
  return location
    ? isNavbarReadmeHidden(location.section, location.product)
    : false;
}

function compareNavbarProducts(leftLabel, rightLabel, section) {
  const getSortMetadata = (label) => {
    const location = getNavbarProductLocation(label, section);
    const frontMatter = location
      ? getNavbarReadmeFrontMatter(location.section, location.product)
      : '';
    const position = Number(
      frontMatter.match(/^sidebar_position:\s*(-?\d+(?:\.\d+)?)\s*$/m)?.[1],
    );

    return {
      position: Number.isFinite(position) ? position : Number.MAX_SAFE_INTEGER,
      path: location ? `${location.section}/${location.product}` : label,
    };
  };
  const left = getSortMetadata(leftLabel);
  const right = getSortMetadata(rightLabel);

  if (left.position !== right.position) {
    return left.position - right.position;
  }

  return left.path < right.path ? -1 : left.path > right.path ? 1 : 0;
}

const productNavbarItems = productNavGroups.flatMap((group) => {
  const section = contextualProductGroups[group.label];
  const groupLink = productNavGroupLinks[group.label];
  const navbarSection =
    section || groupLink?.match(/^\/docs\/([^/?#]+)/)?.[1];

  if (navbarSection && isNavbarReadmeHidden(navbarSection)) {
    return [];
  }

  const labels = group.items
    .filter((label) => !isNavbarProductHidden(label, section))
    .sort((left, right) => compareNavbarProducts(left, right, section));

  return [{
    type: 'dropdown',
    label: group.label,
    position: 'left',
    className: 'product-nav-dropdown',
    ...(groupLink ? {to: withSidebarContext(groupLink, section)} : {}),
    items: labels.map((label) => getProductNavbarItem(label, section)),
  }];
});

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'BearKey Docs',
  tagline: '用 Markdown 驱动的产品文档网站',
  url: 'https://docs.bearkey.com.cn',
  favicon: 'img/favicon.png',
  baseUrl: '/',
  organizationName: 'bearkey-docs',
  projectName: 'docs',
  customFields: {
    docsEditBaseUrl,
    docImageCdnBase:
      process.env.DOC_IMAGE_CDN_BASE ||
      process.env.MANUAL_IMAGE_CDN_BASE ||
      'https://www.bearkey.com.cn/docs-assets',
    manualImageCdnBase:
      process.env.MANUAL_IMAGE_CDN_BASE || 'https://www.bearkey.com.cn/docs-assets',
    comments: {
      giscus: {
        repo: process.env.GISCUS_REPO || 'bearkey-docs/docs',
        repoId: process.env.GISCUS_REPO_ID || 'R_kgDOTIbg8g',
        category: process.env.GISCUS_CATEGORY || '',
        categoryId: process.env.GISCUS_CATEGORY_ID || 'DIC_kwDOTIbg8s4DAIyt',
      },
    },
  },
  trailingSlash: false,
  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
      onBrokenMarkdownImages: 'warn',
    },
    // 未在 front matter 显式写 description 的文档，统一补成空串，
    // 避免 Docusaurus 回退用正文首段（如首图 alt 文本）作为描述，
    // 从而让 DocCardList 卡片在没有 description 时不显示副标题。
    parseFrontMatter: async (params) => {
      const result = await params.defaultParseFrontMatter(params);
      if (result.frontMatter.description === undefined) {
        result.frontMatter.description = '';
      }
      return result;
    },
  },

  i18n: {
    path: 'docs_en',
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans', 'en'],
    localeConfigs: {
      'zh-Hans': {
        label: '中文',
        direction: 'ltr',
      },
      en: {
        label: 'English',
        direction: 'ltr',
      },
    },
  },

  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      /** @type {import('@easyops-cn/docusaurus-search-local').PluginOptions} */
      ({
        hashed: true,
        language: ['en', 'zh'],
        highlightSearchTermsOnTargetPage: true,
      }),
    ],
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: 'docs_cn',
          routeBasePath: 'docs',
          exclude: splitDocSourcePaths,
          sidebarPath: require.resolve('./sidebars.js'),
          sidebarItemsGenerator: localizedSidebarItemsGenerator,
          editUrl: docsEditBaseUrl,
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      docs: {
        sidebar: {
          hideable: true,
        },
      },
      metadata: [
        {
          name: 'description',
          content: '参考 Radxa Docs 风格搭建的 Markdown 文档网页。',
        },
      ],
      navbar: {
        logo: {
          alt: 'Bearkey DOCS',
          src: 'img/bearkey-docs-logo.webp',
          href: '/docs',
        },
        items: [
          {
            to: '/docs',
            position: 'left',
            label: '所有文档',
          },
          ...productNavbarItems,
          {
            href: 'https://www.bearkey.com.cn/index.html',
            position: 'left',
            label: '官网',
            className: 'bearkey-official-nav',
            target: '_blank',
            rel: 'noopener noreferrer',
          },
          {
            type: 'localeDropdown',
            position: 'right',
            className: 'navbar-locale-dropdown',
          },
          {
            type: 'search',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'light',
        links: [
          {
            title: '文档',
            items: [
              {
                label: '开始阅读',
                to: '/docs',
              },
            ],
          },
          {
            title: '项目',
            items: [
              {
                label: 'GitHub 仓库',
                href: 'https://github.com/bearkey-docs/docs',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} 文档网页设计.`,
      },
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 3,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['bash', 'powershell', 'yaml'],
      },
    }),
};

module.exports = config;
