import React from 'react';
import {
  useDocById,
  findFirstSidebarItemLink,
} from '@docusaurus/plugin-content-docs/client';
import {extractLeadingEmoji} from '@docusaurus/theme-common/internal';
import isInternalUrl from '@docusaurus/isInternalUrl';
import Layout from '@theme/DocCard/Layout';

function getFallbackEmojiIcon(item) {
  if (item.type === 'category') {
    return '🗃';
  }
  return isInternalUrl(item.href) ? '📄' : '🔗';
}

function getIconTitleProps(item) {
  const extracted = extractLeadingEmoji(item.label);
  // Docusaurus 的 emoji 提取会把标题开头的数字（如 "8英寸平板" 的 "8"）
  // 误判成数字键帽 emoji，从而被当作放大的图标渲染，导致标题第一个字符
  // 与其余文字大小不一致。这里检测这种情况并保留完整标题。
  const isDigitKeycap = Boolean(extracted.emoji) && /\d/.test(extracted.emoji);
  const hasRealEmoji = Boolean(extracted.emoji) && !isDigitKeycap;
  return {
    icon: hasRealEmoji ? extracted.emoji : getFallbackEmojiIcon(item),
    title: hasRealEmoji ? extracted.rest.trim() : item.label,
  };
}

// 只有当分类/产品的 README.md front matter 里显式写了 description 时才显示卡片副标题。
// 未写 description 时，parseFrontMatter 会把它补成空串，doc.description 为空，
// 因此不会再回退到正文首段（例如首图的 alt 文本），卡片只显示标题。
function CardCategory({item}) {
  const href = findFirstSidebarItemLink(item);
  if (!href) {
    return null;
  }
  return (
    <Layout
      item={item}
      className={item.className}
      href={href}
      description={item.description}
      {...getIconTitleProps(item)}
    />
  );
}

function CardLink({item}) {
  const doc = useDocById(item.docId ?? undefined);
  return (
    <Layout
      item={item}
      className={item.className}
      href={item.href}
      description={item.description ?? doc?.description}
      {...getIconTitleProps(item)}
    />
  );
}

export default function DocCard({item}) {
  switch (item.type) {
    case 'link':
      return <CardLink item={item} />;
    case 'category':
      return <CardCategory item={item} />;
    default:
      throw new Error(`unknown item type ${JSON.stringify(item)}`);
  }
}
