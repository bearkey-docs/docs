import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const officialBaseUrl = 'https://www.bearkey.com.cn';

const footerContent = {
  'zh-Hans': {
    productsTitle: '产品中心',
    supportTitle: '服务与支持',
    contactTitle: '联系我们',
    productPage: 'product.html',
    products: [
      ['核心板', '核心板'],
      ['主板', '主板'],
      ['终端', '终端'],
      ['AIOT解决方案', 'AIOT解决方案'],
      ['OpenHarmony系列产品', 'OpenHarmony'],
      ['MineHarmony系列产品', 'MineHarmony'],
    ],
    support: [
      ['技术支持', `${officialBaseUrl}/service-and-support.html`],
      ['售后服务', `${officialBaseUrl}/service-and-support.html`],
      ['方案定制', `${officialBaseUrl}/solution.html`],
      ['技术应用', `${officialBaseUrl}/support.html`],
      ['开源社区', 'https://www.bearkey.net/'],
      ['维基教程', `${officialBaseUrl}/wiki.html`],
    ],
    tel: '企业电话：0592-5232963',
    business: '商务联系：18606919996',
    addressLabel: '地址：',
    addressParagraphs: [
      '福州市闽侯县上街镇高新大道9号星网锐捷海西科技园1号楼东101单元',
      '厦门市思明区软件园二期望海路39号厦门大学国家科技园209单元',
    ],
    qrcodes: [
      ['商务联系', 'business-contact.webp'],
      ['微信客服', 'wechat-service.webp'],
      ['微信公众号', 'wechat-official.webp'],
      ['淘宝商店', 'taobao.webp'],
    ],
    company: '厦门贝启科技有限公司',
    icp: '闽ICP备15026157号-4',
  },
  en: {
    productsTitle: 'Products',
    supportTitle: 'Service & Support',
    contactTitle: 'Contact Us',
    productPage: 'product_en.html',
    products: [
      ['Core board', 'Core board'],
      ['Motherboard', 'Motherboard'],
      ['Terminal', 'Terminal'],
      ['AIOT solution', 'AIOT solution'],
      ['OpenHarmony series products', 'OpenHarmony'],
      ['MineHarmony series products', 'MineHarmony'],
    ],
    support: [
      ['Technical support', `${officialBaseUrl}/service-and-support_en.html`],
      ['After-sales service', `${officialBaseUrl}/service-and-support_en.html`],
      ['Customized Solutions', `${officialBaseUrl}/solution_en.html`],
      ['Technology Application', `${officialBaseUrl}/support_en.html`],
      ['Open source community', 'https://www.bearkey.net/'],
    ],
    tel: 'Tel: +86-592-5232963',
    business: 'Business  : (+86)18606919996',
    addressLabel: 'Address :',
    addressParagraphs: [
      'Unit 101, East Wing, Building 1, Xingwang Ruijie Haixi Science and Technology Park, No. 9, Gaoxin Avenue, Shangjie Town, Minhou County, Fuzhou City',
      'Unit 209, Xiamen University National Science and Technology Park, No. 39, Wanghai Road, Software Park Phase II, Siming District, Xiamen City',
    ],
    qrcodes: [
      ['Business', 'business-contact-en.webp'],
      ['Wechat', 'wechat-service-en.webp'],
      ['Official Account', 'wechat-official-en.webp'],
      ['Store', 'taobao-en.webp'],
    ],
    company: 'Xiamen Bearkey Technology Co., Ltd.',
    icp: '闽ICP备15026157号-4',
  },
};

function getProductHref(localeContent, filter) {
  return `${officialBaseUrl}/${localeContent.productPage}?filter=${encodeURIComponent(filter)}`;
}

function FooterLink({href, children}) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

export default function Footer() {
  const {
    i18n: {currentLocale},
  } = useDocusaurusContext();
  const qrBaseUrl = useBaseUrl('/img/bearkey-footer/');
  const year = new Date().getFullYear();
  const content = footerContent[currentLocale] ?? footerContent['zh-Hans'];

  return (
    <footer
      className={`bearkey-footer ${currentLocale === 'en' ? 'index_en' : ''}`}
      data-lang={currentLocale === 'en' ? 'en' : 'zh'}>
      <div className="container bearkey-footer__container">
        <div className="row bearkey-footer__row">
          <div className="col-md-4 bearkey-footer__col">
            <div className="widget">
              <h5 className="widgetheading">{content.productsTitle}</h5>
              <ul className="link-list" id="product_solution_container">
                {content.products.map(([label, filter]) => (
                  <li key={label}>
                    <FooterLink href={getProductHref(content, filter)}>{label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-md-4 bearkey-footer__col">
            <div className="widget">
              <h5 className="widgetheading">{content.supportTitle}</h5>
              <ul className="link-list" id="service_support_container">
                {content.support.map(([label, href]) => (
                  <li key={label}>
                    <FooterLink href={href}>{label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-md-4 bearkey-footer__col bearkey-footer__col--contact">
            <div className="widget">
              <h5 className="widgetheading">{content.contactTitle}</h5>
              <div className="contact-section">
                <ul className="link-list" id="contact_info_container">
                  <li>{content.tel}</li>
                  <li>{content.business}</li>
                </ul>
                <div id="office_address_container" className="office-address">
                  <div className="address-line">
                    <span className="address-prefix">{content.addressLabel}</span>
                    <span className="address-content">
                      {content.addressParagraphs.map((paragraph) => (
                        <span className="address-paragraph" key={paragraph}>
                          {paragraph}
                        </span>
                      ))}
                    </span>
                  </div>
                </div>
              </div>
              <div id="follow_us_container">
                {content.qrcodes.map(([label, src]) => (
                  <div className="qrcode-item" key={label}>
                    <img src={`${qrBaseUrl}${src}`} alt={label} loading="lazy" />
                    <span className="qrcode-title">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-divider" />
      <div className="footer-copyright">
        <p>
          Copyright © 2015-{year}
          {content.company} All Rights Reserved.|
          <FooterLink href="http://beian.miit.gov.cn"> {content.icp}</FooterLink>
        </p>
      </div>
    </footer>
  );
}
