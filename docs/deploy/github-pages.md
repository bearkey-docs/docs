---
sidebar_position: 1
title: GitHub Pages 自动发布
description: Markdown 更新后如何自动同步到文档网页。
---

# GitHub Pages 自动发布

文档网站的同步方式是“提交触发构建”，不是网页实时读取 GitHub Markdown。

## 自动同步流程

1. 修改 `docs/` 中的 Markdown / MDX 文件
2. 提交并 push 到 GitHub
3. GitHub Actions 自动运行
4. 执行 `npm ci` 安装依赖
5. 执行 `npm run build` 生成静态网页
6. 发布 `build/` 目录到 GitHub Pages

## 本地预览

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run start
```

构建生产版本：

```bash
npm run build
```

## GitHub Pages 设置

在仓库的 GitHub 页面中打开：

```text
Settings → Pages → Build and deployment → Source → GitHub Actions
```

设置完成后，每次合并到默认分支都会自动发布最新网页。
