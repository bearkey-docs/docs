import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

const officialBaseUrl = 'https://www.bearkey.com.cn';

const productLinks = [
  ['核心板', '核心板'],
  ['主板', '主板'],
  ['终端', '终端'],
  ['AIOT解决方案', 'AIOT解决方案'],
  ['OpenHarmony系列产品', 'OpenHarmony'],
  ['MineHarmony系列产品', 'MineHarmony'],
].map(([label, filter]) => ({
  label,
  href: `${officialBaseUrl}/product.html?filter=${encodeURIComponent(filter)}`,
}));

const supportLinks = [
  ['技术支持', `${officialBaseUrl}/service-and-support.html`],
  ['售后服务', `${officialBaseUrl}/service-and-support.html`],
  ['方案定制', `${officialBaseUrl}/solution.html`],
  ['技术应用', `${officialBaseUrl}/support.html`],
  ['开源社区', 'https://www.bearkey.net/'],
  ['维基教程', `${officialBaseUrl}/wiki.html`],
].map(([label, href]) => ({label, href}));

const qrCodes = [
  ['商务联系', 'business-contact.webp'],
  ['微信客服', 'wechat-service.webp'],
  ['微信公众号', 'wechat-official.webp'],
  ['淘宝商店', 'taobao.webp'],
];

function FooterLink({href, children}) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

export default function Footer() {
  const qrBaseUrl = useBaseUrl('/img/bearkey-footer/');
  const year = new Date().getFullYear();

  return (
    <footer className="bearkey-footer">
      <div className="bearkey-footer__inner">
        <section className="bearkey-footer__column">
          <h2>产品中心</h2>
          <ul>
            {productLinks.map((item) => (
              <li key={item.label}>
                <FooterLink href={item.href}>{item.label}</FooterLink>
              </li>
            ))}
          </ul>
        </section>

        <section className="bearkey-footer__column">
          <h2>服务与支持</h2>
          <ul>
            {supportLinks.map((item) => (
              <li key={item.label}>
                <FooterLink href={item.href}>{item.label}</FooterLink>
              </li>
            ))}
          </ul>
        </section>

        <section className="bearkey-footer__contact">
          <h2>联系我们</h2>
          <ul className="bearkey-footer__contact-list">
            <li>企业电话：0592-5232963</li>
            <li>商务联系：18606919996</li>
            <li>
              地址：福州市闽侯县上街镇高新大道9号星网锐捷海西科技园1号楼东101单元
            </li>
            <li>厦门市思明区软件园二期望海路39号厦门大学国家科技园209单元</li>
          </ul>
          <div className="bearkey-footer__qrcodes">
            {qrCodes.map(([label, src]) => (
              <figure key={label}>
                <img src={`${qrBaseUrl}${src}`} alt={label} loading="lazy" />
                <figcaption>{label}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      </div>
      <div className="bearkey-footer__copyright">
        <span>Copyright © 2015-{year} 厦门贝启科技有限公司 All Rights Reserved.</span>
        <span>|</span>
        <FooterLink href="http://beian.miit.gov.cn">闽ICP备15026157号-4</FooterLink>
      </div>
    </footer>
  );
}
