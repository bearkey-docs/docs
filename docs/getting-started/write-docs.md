---
sidebar_position: 1
title: 编写文档
description: 如何用 Markdown 编写会自动发布到网页的文档。
---

# 编写文档

文档页面放在 `docs/` 目录中。每个 Markdown 文件都会被 Docusaurus 转换成网页。

## 新增页面

在 `docs/` 中创建文件：

```text
docs/getting-started/example.md
```

文件内容示例：

```md
---
sidebar_position: 2
title: 示例页面
---

# 示例页面

这里写正文内容。
```

## 控制目录顺序

`sidebar_position` 用来控制左侧目录的排序。

```yaml
---
sidebar_position: 1
---
```

## 使用提示框

```md
:::tip
这是一个提示信息。
:::

:::warning
这是一个警告信息。
:::
```

:::tip
提示框会在网页中渲染为醒目的信息卡片，适合展示注意事项、风险和建议。
:::

## 使用代码块

代码块需要写明语言，方便自动高亮。

```bash
npm run build
```

```powershell
git clone https://github.com/CacheBiomancerClash/document-web-design.git
```
