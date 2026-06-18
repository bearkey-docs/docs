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

## 主要目录

| 路径 | 说明 |
| --- | --- |
| `docs/` | 文档内容 |
| `src/pages/` | 自定义网页 |
| `src/css/custom.css` | 主题样式 |
| `.github/workflows/deploy.yml` | 自动部署配置 |
