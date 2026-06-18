// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: '快速开始',
      collapsed: false,
      items: ['getting-started/write-docs'],
    },
    {
      type: 'category',
      label: '发布部署',
      collapsed: false,
      items: ['deploy/github-pages'],
    },
    {
      type: 'category',
      label: '设计参考',
      collapsed: false,
      items: ['reference/radxa-style'],
    },
  ],
};

module.exports = sidebars;
