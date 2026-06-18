---
sidebar_position: 1
title: Radxa 风格参考
description: 本项目参考 Radxa Docs 的哪些文档网页设计方式。
---

# Radxa 风格参考

本项目参考了 Radxa Docs 的文档网页组织方式，但不是复制其代码或品牌视觉。

## 参考点

| 设计点 | 本项目实现 |
| --- | --- |
| 顶部导航 | 项目名称、文档入口、GitHub 链接 |
| 左侧目录 | `sidebars.js` 管理文档层级 |
| 正文排版 | 清晰标题层级、表格、代码块 |
| 右侧目录 | 根据二级和三级标题自动生成 |
| 提示框 | 使用 Docusaurus admonition 语法 |
| 自动部署 | GitHub Actions 构建并发布 |

## 文档 URL 生成

文档文件路径会映射为网页路径。

```text
docs/getting-started/write-docs.md
```

会生成：

```text
/docs/getting-started/write-docs
```

## 内容复用

如果后续需要像 Radxa 那样复用通用内容，可以使用 MDX 组件。

```mdx
import CommonBlock from '../_partials/common-block.mdx';

# 页面标题

<CommonBlock />
```

这样多个页面可以共享同一段说明，减少重复维护。
