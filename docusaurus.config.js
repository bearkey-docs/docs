// @ts-check

const lightCodeTheme = require('prism-react-renderer').themes.github;
const darkCodeTheme = require('prism-react-renderer').themes.dracula;

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
  'RK3588 核心板': '/docs/core-board/rk3588-core-board/product-specification',
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


const productGroupLinks = {
  '核心板': '/docs/core-board',
  '主板': '/docs/main-board',
  '终端': '/docs/terminal',
  'AIOT解决方案': '/docs/aiot-solutions',
  OpenHarmony: '/docs/openharmony',
  MineHarmony: '/docs/mineharmony',
};

const getProductNavbarItem = (label) =>
  productDocLinks[label]
    ? {
        label,
        to: productDocLinks[label],
      }
    : {
        label,
        href: '#',
      };

const productNavbarItems = productNavGroups.map((group) => ({
  type: 'dropdown',
  label: group.label,
  to: productGroupLinks[group.label],
  position: 'left',
  className: 'product-nav-dropdown',
  items: group.items.map(getProductNavbarItem),
}));

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '文档网页设计',
  tagline: '用 Markdown 驱动的产品文档网站',
  url: 'https://docs.fengxinglong.top',
  baseUrl: '/',
  organizationName: 'CacheBiomancerClash',
  projectName: 'document-web-design',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
      onBrokenMarkdownImages: 'warn',
    },
  },

  i18n: {
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
          routeBasePath: 'docs',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/CacheBiomancerClash/document-web-design/tree/devin/initial-readme/',
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
      metadata: [
        {
          name: 'description',
          content: '参考 Radxa Docs 风格搭建的 Markdown 文档网页。',
        },
      ],
      navbar: {
        title: '文档网页设计',
        logo: {
          alt: 'Docs logo',
          src: 'img/logo.svg',
          href: '/docs/intro',
        },
        items: [
          {
            to: '/docs/intro',
            position: 'left',
            label: '所有文档',
          },
          ...productNavbarItems,
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
                to: '/docs/intro',
              },
            ],
          },
          {
            title: '项目',
            items: [
              {
                label: 'GitHub 仓库',
                href: 'https://github.com/CacheBiomancerClash/document-web-design',
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
