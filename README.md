# 文档网页设计

参考 Radxa Docs 风格搭建的 Markdown 文档网站。

## 技术栈

- [Docusaurus](https://docusaurus.io/)
- React
- Markdown / MDX
- GitHub Actions
- GitHub Pages

## 本地运行

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run start
```

构建静态网站：

```bash
npm run build
```

## 文档同步方式

文档内容放在 `docs/` 目录。更新 Markdown / MDX 后提交到 GitHub，GitHub Actions 会自动构建静态网页并部署到 GitHub Pages。

## 中英文文档目录

本站使用 Docusaurus 多语言目录：

| 语言 | 放置目录 |
| --- | --- |
| 中文 | `docs/` |
| 英文 | `i18n/en/docusaurus-plugin-content-docs/current/` |

英文文档请和中文文档保持相同相对路径和文件名，例如：

```text
docs/core-board/rk3588-core-board/product-specification.md
i18n/en/docusaurus-plugin-content-docs/current/core-board/rk3588-core-board/product-specification.md
```

新增 Markdown / MDX 后，`npm run ensure-categories` 会扫描中文和英文目录，自动补齐缺失的 `_category_.json`。GitHub Actions 在 push 构建时会把这些自动生成的分类文件提交回仓库，左侧栏会跟随文档目录自动更新。

## 主要目录

| 路径 | 说明 |
| --- | --- |
| `docs/` | 中文文档内容 |
| `i18n/en/docusaurus-plugin-content-docs/current/` | 英文文档内容 |
| `src/pages/` | 自定义网页 |
| `src/css/custom.css` | 主题样式 |
| `.github/workflows/deploy.yml` | 自动部署配置 |
