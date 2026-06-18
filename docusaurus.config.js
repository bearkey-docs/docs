// @ts-check

const lightCodeTheme = require('prism-react-renderer').themes.github;
const darkCodeTheme = require('prism-react-renderer').themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '文档网页设计',
  tagline: '用 Markdown 驱动的产品文档网站',
  url: 'https://cachebiomancerclash.github.io',
  baseUrl: '/document-web-design/',
  organizationName: 'CacheBiomancerClash',
  projectName: 'document-web-design',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

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
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docsSidebar',
            position: 'left',
            label: '文档',
          },
          {
            href: 'https://github.com/CacheBiomancerClash/document-web-design',
            label: 'GitHub',
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
              {
                label: '编写 Markdown',
                to: '/docs/getting-started/write-docs',
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
