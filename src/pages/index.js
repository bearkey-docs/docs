import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

const features = [
  {
    title: 'Markdown 驱动',
    description: '文档内容直接写在 GitHub 仓库中，提交后由构建流程生成静态网页。',
  },
  {
    title: '清晰的阅读布局',
    description: '参考 Radxa Docs 的三栏结构：左侧导航、正文内容、右侧本页目录。',
  },
  {
    title: '自动发布',
    description: 'GitHub Actions 在仓库更新后自动构建，并发布到 GitHub Pages。',
  },
];

function Feature({title, description}) {
  return (
    <article className={styles.featureCard}>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}

export default function Home() {
  return (
    <Layout
      title="首页"
      description="参考 Radxa Docs 风格的 Markdown 文档网页">
      <header className={clsx('hero', styles.heroBanner)}>
        <div className="container">
          <span className={styles.eyebrow}>Documentation Website</span>
          <Heading as="h1" className={styles.heroTitle}>
            文档网页设计
          </Heading>
          <p className={styles.heroSubtitle}>
            把 GitHub 仓库中的 Markdown / MDX 文档自动构建为结构清晰的网页。
          </p>
          <div className={styles.buttons}>
            <Link className="button button--primary button--lg" to="/docs/intro">
              开始阅读
            </Link>
            <Link
              className="button button--secondary button--lg"
              to="https://github.com/CacheBiomancerClash/document-web-design">
              查看 GitHub
            </Link>
          </div>
        </div>
      </header>
      <main>
        <section className={styles.features}>
          <div className="container">
            <div className="row">
              {features.map((props) => (
                <div className="col col--4" key={props.title}>
                  <Feature {...props} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
