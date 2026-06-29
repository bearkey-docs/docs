// @ts-check

const {hasEnglishDoc, isEnglishBuild} = require('./scripts/english-docs');
const lightCodeTheme = require('prism-react-renderer').themes.github;
const darkCodeTheme = require('prism-react-renderer').themes.dracula;

function filterEnglishSidebarItems(items) {
  return items.flatMap((item) => {
    if (item.type === 'doc') {
      return hasEnglishDoc(item.id) ? [item] : [];
    }

    if (item.type !== 'category') {
      return [item];
    }

    const filteredItems = filterEnglishSidebarItems(item.items);

    if (filteredItems.length === 0) {
      return [];
    }

    if (item.link?.type === 'doc' && !hasEnglishDoc(item.link.id)) {
      const itemWithoutLink = {...item};
      delete itemWithoutLink.link;
      return [{ ...itemWithoutLink, items: filteredItems }];
    }

    return [{ ...item, items: filteredItems }];
  });
}

async function localizedSidebarItemsGenerator(args) {
  const items = await args.defaultSidebarItemsGenerator(args);

  return isEnglishBuild() ? filterEnglishSidebarItems(items) : items;
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
      'RK3568 主板',
      'RK3568 工业控制主板',
      'RK3576 工业控制主板',
      'RK3588 工业主板',
      'RK3576 商业显示主板',
      'RK3588 主板',
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
      'RK3568工控屏',
      'RK3588 边缘控制网关',
      '工控屏',
      '拼接屏处理器',
      '视频优化盒子',
      'RK3588边缘计算工业网关',
      'RK3568-15.6英寸屏',
      'RK3506 工控屏',
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
      'RK3568 主板',
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
      'RK3588 主板',
      '拼接屏处理器',
    ],
  },
  {
    label: 'MineHarmony',
    items: [
      'RK3568 主板',
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
  'RK3588 核心板': '/docs',
  'RK3568 工业级核心板': '/docs/core-board/rk3568-industrial-core-board/product-specification',
  'RK3399 Pro 核心板': '/docs/core-board/rk3399-pro-core-board/product-specification',
  'TB-96AIoT-1808CO': '/docs/core-board/tb-96aiot-1808co/product-specification',
  'RK3568 主板': '/docs/main-board/rk3568-main-board/product-specification',
  'RK3568 工业控制主板': '/docs/main-board/rk3568-industrial-control-main-board/product-specification',
  'RK3576 工业控制主板': '/docs/main-board/rk3576-industrial-control-main-board/product-specification',
  'RK3588 工业主板': '/docs/main-board/rk3588-industrial-main-board/product-specification',
  'RK3588工业主板': '/docs/main-board/rk3588-industrial-main-board/product-specification',
  'RK3576 商业显示主板': '/docs/main-board/rk3576-commercial-display-main-board/product-specification',
  'RK3588 主板': '/docs/main-board/rk3588-main-board/product-specification',
  'Robo3588机器人主板': '/docs/main-board/robo3588-robot-main-board/product-specification',
  'RK3506 工业主板': '/docs/main-board/rk3506-industrial-main-board/product-specification',
  'AI边缘工作站': '/docs/terminal/ai-edge-workstation/product-specification',
  'RK3576 数据采集网关': '/docs/terminal/rk3576-data-acquisition-gateway/product-specification',
  '8英寸平板': '/docs/terminal/eight-inch-tablet/product-specification',
  '10.6英寸平板': '/docs/terminal/ten-six-inch-tablet/product-specification',
  '11英寸平板': '/docs/terminal/eleven-inch-tablet/product-specification',
  'RK3568 数据采集网关': '/docs/terminal/rk3568-data-acquisition-gateway/product-specification',
  'RK3568工控屏': '/docs/terminal/rk3568-industrial-panel/product-specification',
  'RK3588 边缘控制网关': '/docs/terminal/rk3588-edge-control-gateway/product-specification',
  '工控屏': '/docs/terminal/industrial-panel/product-specification',
  '拼接屏处理器': '/docs/terminal/video-wall-processor/product-specification',
  '视频优化盒子': '/docs/terminal/video-optimization-box/product-specification',
  'RK3588边缘计算工业网关': '/docs/terminal/rk3588-edge-computing-industrial-gateway/product-specification',
  'RK3568-15.6英寸屏': '/docs/terminal/rk3568-15-6-inch-panel/product-specification',
  'RK3506 工控屏': '/docs/terminal/rk3506-industrial-panel/product-specification',
  'Carrier Board': '/docs/main-board/carrier-board/product-specification',
};


const contextualProductGroups = {
  'AIOT解决方案': 'aiot-solutions',
  OpenHarmony: 'openharmony',
  MineHarmony: 'mineharmony',
};

const withSidebarContext = (to, section) =>
  section ? `${to}?section=${section}` : to;

const getProductNavbarItem = (label, section) =>
  productDocLinks[label]
    ? {
        label,
        to: withSidebarContext(productDocLinks[label], section),
        ...(label === 'RK3588 核心板'
          ? {activeBaseRegex: '^/docs/?$'}
          : {}),
      }
    : {
        label,
        href: '#',
      };

const productNavbarItems = productNavGroups.map((group) => {
  const section = contextualProductGroups[group.label];

  return {
    type: 'dropdown',
    label: group.label,
    position: 'left',
    className: 'product-nav-dropdown',
    items: group.items.map((label) => getProductNavbarItem(label, section)),
  };
});

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '文档网页设计',
  tagline: '用 Markdown 驱动的产品文档网站',
  url: 'https://docs.fengxinglong.top',
  favicon: 'img/favicon.png',
  baseUrl: '/',
  organizationName: 'bearkey-docs',
  projectName: 'docs',
  customFields: {
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
          sidebarPath: require.resolve('./sidebars.js'),
          sidebarItemsGenerator: localizedSidebarItemsGenerator,
          editUrl:
            'https://github.com/bearkey-docs/docs/tree/main/',
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
