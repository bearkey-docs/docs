# document-web-design 文档新增教程

这篇文档说明如何在 `document-web-design` 仓库里新增分类、产品目录、文章和图片资源。

> 重要更新：
> 1. **分类/产品现在用 `README.md` 管理，不再使用 `_category_.json`。** 分类首页、产品首页的名称、排序、路径都由 `README.md` 的 front matter 决定（仓库里已经没有 `_category_.json` 了）。
> 2. **源 md 加 `split_by_h2: true` 就能自动把一篇长文按二级标题拆成多个卡片子页面。** 详见第 4 节。

## 1. 先看仓库目录

常用目录：

| 路径 | 用途 |
| --- | --- |
| `docs_cn/` | 中文文档根目录，中文页面都放这里（站点路由前缀是 `/docs`）。 |
| `docs_en/en/docusaurus-plugin-content-docs/current/` | 英文文档根目录，只有有英文内容时才同步创建。 |
| `static/` | 全站公共静态资源，比如 logo、全站共用图片。普通文章图片不建议放这里。 |
| `scripts/` | 文档准备脚本。`prepare-docs` 会转换图片、按 `split_by_h2` 拆分文档、补齐分类信息。 |
| `sidebars.js` | 侧边栏入口配置，大部分产品目录会按文件夹自动生成。 |
| `src/generated/splitDocSourceIds.json` | 脚本自动生成的「拆分文档」清单，不要手改。 |

## 2. 当前文档层级

分类和产品都用 `README.md` 作为「首页」来管理，站点主要按这个结构组织：

```text
docs_cn/
├── core-board/                 # 核心板（分类）
│   ├── README.md               # 分类首页：决定分类名称/排序/路径（DocCardList 卡片列表）
│   └── rk3588-core-board/      # 某个产品
│       ├── README.md           # 产品首页（原来的 product-specification.md）
│       ├── wiki-tutorial.md    # 源 md，可加 split_by_h2 自动拆分
│       ├── wiki-tutorial/      # 由脚本自动生成的拆分子页面目录（勿手改）
│       ├── images/             # 规格书图片
│       └── wiki-tutorial-assets/
├── main-board/                 # 主板
├── terminal/                   # 终端
├── reference/                  # 其他
├── aiot-solutions/             # AIOT 解决方案
├── openharmony/                # OpenHarmony
└── mineharmony/                # MineHarmony
```

英文目录路径要和中文目录保持一致（把 `docs_cn/` 换成 `docs_en/en/docusaurus-plugin-content-docs/current/`）：

```text
中文：docs_cn/core-board/rk3588-core-board/README.md
英文：docs_en/en/docusaurus-plugin-content-docs/current/core-board/rk3588-core-board/README.md
```

如果文章只有中文，不要在英文目录创建同名文件。

## 3. 用 README.md 管理分类和产品

不再需要 `_category_.json`。名称、排序、访问路径都写在 `README.md` 的 front matter 里。

### 3.1 分类首页（`docs_cn/<分类>/README.md`）

```md
---
sidebar_position: 1
sidebar_label: 核心板
title: 核心板
slug: /core-board
---

import DocCardList from '@theme/DocCardList';

# 核心板

核心板文档汇总如下，点击产品进入对应产品规格书和 Wiki 教程。

<DocCardList />
```

字段说明：

- `sidebar_position`：这个分类在侧边栏里的排序，越小越靠前。
- `sidebar_label`：侧边栏显示的分类名称。
- `title`：页面标题。
- `slug`：分类首页的访问路径，例如 `/core-board`（顶部导航就是跳到这个地址）。
- `<DocCardList />`：自动把该分类下的产品渲染成卡片列表。

### 3.2 产品首页（`docs_cn/<分类>/<产品>/README.md`）

产品的「首页」就是原来的产品规格书，现在统一叫 `README.md`：

```md
---
sidebar_position: 1
slug: /core-board/rk3588-core-board
sidebar_label: RK3588 核心板
title: RK3588 核心板产品规格书
---

# RK3588 核心板产品规格书

![RK3588 核心板产品规格书第 2 页](./images/page-02.webp)
```

字段说明：

- `sidebar_label`：侧边栏里这个产品的名称。
- `slug`：产品首页访问路径，例如 `/core-board/rk3588-core-board`。
- `sidebar_position`：产品内部各页面的排序（产品首页一般设为 1）。
- `description`：**（可选）分类首页里这张产品卡片标题下方显示的副标题**，详见 3.3。

> 没有产品规格书的产品，就不用建 `README.md`；侧边栏名称会退化成脚本按目录名补的默认值，可按需再补 `README.md`。

### 3.3 卡片副标题（`description`）显示规则

分类首页用 `<DocCardList />` 把下属分类/产品渲染成卡片。每张卡片标题下方的副标题遵循以下规则：

- 如果该分类/产品的 `README.md` front matter 里写了 `description:`，卡片副标题就显示它；
- 如果**没写** `description:`，卡片就**只显示标题、不显示副标题**（不会再自动回退成正文首段或首图的 alt 文本）。

需要副标题时，在对应 `README.md` 里加一行即可，例如：

```md
---
sidebar_label: 拼接屏处理器
title: 拼接屏处理器产品规格书
description: 面向拼接大屏的高性能处理器
---
```

## 4. 源 md 加 `split_by_h2: true` 自动拆分卡片子页面

对于内容很长的文章（典型是 `wiki-tutorial.md`），只要在源 md 的 front matter 里加上 `split_by_h2: true`，脚本 `scripts/split-doc-card-pages.js` 就会把它按 **二级标题（`##`）** 拆成多个子页面，并生成一个卡片列表首页。

### 4.1 源 md 怎么写

```md
---
sidebar_position: 2
split_by_h2: true
slug: /_split-source/core-board/rk3588-core-board/wiki-tutorial
unlisted: true
sidebar_label: Wiki 教程
title: RK3588 核心板 Wiki 教程
---

# RK3588 核心板

## 一、快速上手
……

## 二、Linux 开发
……
```

关键字段：

- `split_by_h2: true`：开启拆分。
- `slug: /_split-source/<分类>/<产品>/wiki-tutorial`：源 md 本身移到 `_split-source` 路径下（作为数据源，不直接展示）。
- `unlisted: true`：源 md 不出现在侧边栏，只展示自动生成的卡片首页。
- `sidebar_label` / `title`：会成为生成的卡片首页（`wiki-tutorial/README.md`）的标题。

### 4.2 拆分规则

- **只有 `##`（二级标题）是拆分点**：每个 `##` 变成一个独立子页面（`01.md`、`02.md`…），子页面的标题取自该 `##` 文本。
- `###` 及更深的标题不会拆分，会跟随所属的 `##` 一起归到对应子页面里。
- 所以想控制「拆成几张卡片」，就调整 `##` 的层级：想合并就把某些 `##` 降成 `###`，想新增卡片就把某段提升为 `##`。
- 文首的 `#`（H1）作为「父标题」，用于给子页面标题加前缀（例如 `RK3588核心板 - 一、快速上手`）。

### 4.3 生成结果（脚本产物，勿手改）

```text
docs_cn/core-board/rk3588-core-board/
├── wiki-tutorial.md            # 源 md（唯一数据源，改内容改这里）
└── wiki-tutorial/              # 自动生成
    ├── .split-doc-generated    # 生成标记，脚本靠它识别可覆盖目录
    ├── README.md               # 卡片列表首页（DocCardList）
    ├── 01.md                   # 第一个 ## 小节
    ├── 02.md
    └── ……
```

注意事项：

- **不要手改 `wiki-tutorial/` 里的文件**，下次重新生成会被覆盖；要改内容请改源 md `wiki-tutorial.md`。
- 生成目录里有 `.split-doc-generated` 标记；脚本只会覆盖带此标记的目录，防止误删手写目录。
- 所有开启拆分的文档 id 会被写进 `src/generated/splitDocSourceIds.json`（`sidebars.js` 会读它把源文档指向生成的 README）。

### 4.4 修改源 md 后如何重新生成

源 md 是唯一数据源，改完重新生成即可：

```bash
npm run split-docs     # 只跑拆分脚本
# 或
npm run prepare-docs   # 图片转 webp + 拆分 + 补分类
```

`npm run build` 之前会自动执行 `prebuild → prepare-docs`，所以正常构建/部署会自动重新生成，无需手动操作。

## 5. 在已有产品下面新增一篇普通文章

例如要给 `RK3588 核心板` 新增一篇“使用说明”。

推荐路径：

```text
docs_cn/core-board/rk3588-core-board/user-guide.md
```

文章内容示例：

```md
---
sidebar_position: 3
sidebar_label: 使用说明
title: RK3588 核心板使用说明
---

# RK3588 核心板使用说明

正文内容写在这里。

![接线示意](./user-guide-assets/wiring.webp)
```

如果这篇文章有图片，新建同名资源目录：

```text
docs_cn/core-board/rk3588-core-board/user-guide-assets/
└── wiring.webp
```

推荐规则：

- 每篇文章用自己的 `文章名-assets/` 目录，避免图片混在一起。
- Markdown 里用相对路径引用图片，例如 `./user-guide-assets/wiring.webp`。
- 图片文件名尽量用英文、数字、短横线，例如 `power-wiring.webp`。

## 6. 新增一个顶级分类

例如要新增一个顶级分类“开发工具”。

创建目录并新增分类首页 `README.md`：

```text
docs_cn/development-tools/README.md
```

内容示例：

```md
---
sidebar_position: 9
sidebar_label: 开发工具
title: 开发工具
slug: /development-tools
---

import DocCardList from '@theme/DocCardList';

# 开发工具

<DocCardList />
```

然后在里面新增文章：

```text
docs_cn/development-tools/flashing-tools.md
```

文章示例：

```md
---
sidebar_position: 1
sidebar_label: 烧录工具
title: 烧录工具
---

# 烧录工具

正文内容写在这里。
```

注意：如果是全新的顶级分类，可能还需要检查 `sidebars.js` 是否已经把这个目录加入侧边栏，以及 `docusaurus.config.js` 顶部导航是否需要加对应入口。现有的 `core-board`、`main-board`、`terminal`、`reference` 等目录已经接入。

## 7. 图片应该放哪里

### 普通文章图片

放到文章旁边的资源目录：

```text
docs_cn/core-board/rk3588-core-board/user-guide.md
docs_cn/core-board/rk3588-core-board/user-guide-assets/picture1.webp
```

引用：

```md
![图片说明](./user-guide-assets/picture1.webp)
```

### 产品规格书图片

规格书（产品 `README.md`）目前常用 `images/`：

```text
docs_cn/core-board/rk3588-core-board/README.md
docs_cn/core-board/rk3588-core-board/images/page-02.webp
```

引用：

```md
![第 2 页](./images/page-02.webp)
```

> 拆分文档里的相对图片引用会被脚本自动补上 `../` 前缀（因为子页面比源 md 多了一层目录），所以在源 md 里正常用 `./xxx-assets/pic.webp` 即可。

### 全站公共图片

只有 logo、全站通用图标、公共素材才放 `static/`。

## 8. 中英文同步规则

### 中文文章

放在：

```text
docs_cn/...
```

### 英文文章

放在：

```text
docs_en/en/docusaurus-plugin-content-docs/current/...
```

英文文章路径要和中文保持同样相对路径。例如：

```text
docs_cn/main-board/rk3568-main-board/wiki-tutorial.md
docs_en/en/docusaurus-plugin-content-docs/current/main-board/rk3568-main-board/wiki-tutorial.md
```

如果只有中文内容，不要创建英文文件。英文站会通过脚本过滤，只显示英文目录里真实存在的文档。

## 9. 新增后必须运行的命令

新增或修改文档后，先运行：

```bash
npm run prepare-docs
```

它会做三件事：

1. 把 Markdown 里引用的本地 `png/jpg/jpeg` 图片转换成 `webp`。
2. 对带 `split_by_h2: true` 的源 md 按二级标题拆分，生成卡片子页面。
3. 补齐缺失的分类信息和英文文档路径索引。

然后运行构建：

```bash
npm run build
```

如果 `prepare-docs` 修改/生成了文件，要把生成的 `.webp`、拆分目录、更新后的 `.md`、`src/generated/splitDocSourceIds.json` 一起提交。

## 10. 提交前检查清单

- [ ] 新文章放在正确分类目录下（中文在 `docs_cn/`）。
- [ ] 分类首页 / 产品首页用 `README.md` 管理（有 `sidebar_label`、`slug`、`title`），不再用 `_category_.json`。
- [ ] 普通文章有 frontmatter：`sidebar_position`、`sidebar_label`、`title`。
- [ ] 需要拆分的长文加了 `split_by_h2: true`，且拆分点（`##`）符合预期。
- [ ] 拆分生成的子目录没有手改（内容改在源 md）。
- [ ] 图片放在文章旁边的资源目录，引用路径是相对路径。
- [ ] 只有中文内容时没有新增英文目录文件；有英文内容时英文路径和中文一致。
- [ ] 已运行 `npm run prepare-docs`。
- [ ] 已运行 `npm run build`。
