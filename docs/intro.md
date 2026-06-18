---
sidebar_position: 1
title: 项目概览
description: 文档网页设计项目的目标、结构和工作方式。
---

# 项目概览

这个项目用于演示如何把 GitHub 仓库中的 Markdown / MDX 文档生成一个可访问的文档网页。

页面风格参考 Radxa Docs：顶部导航、左侧文档目录、正文阅读区域、右侧本页目录、代码块、提示框和表格排版。

## 工作方式

```text
GitHub Markdown / MDX
        │
        ▼
Docusaurus 构建
        │
        ▼
静态 HTML / CSS / JavaScript
        │
        ▼
GitHub Pages 发布
```

## 仓库结构

| 路径 | 作用 |
| --- | --- |
| `docs/` | Markdown / MDX 文档内容 |
| `src/pages/` | 自定义页面，例如首页 |
| `src/css/custom.css` | 文档网站主题样式 |
| `sidebars.js` | 左侧文档目录配置 |
| `docusaurus.config.js` | 网站配置 |
| `.github/workflows/deploy.yml` | 自动构建和部署流程 |

:::tip
更新文档时，主要修改 `docs/` 目录下的 `.md` 或 `.mdx` 文件即可。
:::

## 页面能力

- 自动生成文档路由
- 自动生成左侧目录
- 自动生成右侧本页目录
- 支持代码高亮
- 支持提示框、表格、链接、图片
- 支持 GitHub Actions 自动发布

## 同步验证

这是一条用于验证 GitHub 仓库更新会自动同步到文档网页的测试内容。

更新时间：2026-06-18
