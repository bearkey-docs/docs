import React from 'react';
import OriginalDocCardList from '@theme-original/DocCardList';
import {
  useCurrentSidebarSiblings,
} from '@docusaurus/plugin-content-docs/client';

const hiddenClassSet = new Set([
  'sidebar-docs-index-hidden',
  'sidebar-section-hidden',
]);

function filterHiddenItems(items = []) {
  return items.filter((item) => {
    const classes = (item.className || '').split(/\s+/);
    return !classes.some((c) => hiddenClassSet.has(c));
  });
}

function CurrentSidebarCards(props) {
  const items = useCurrentSidebarSiblings();
  return (
    <OriginalDocCardList
      {...props}
      items={filterHiddenItems(items)}
    />
  );
}

export default function DocCardList(props) {
  const {items, ...rest} = props;

  if (!items) {
    return <CurrentSidebarCards {...rest} />;
  }

  return (
    <OriginalDocCardList
      {...rest}
      items={filterHiddenItems(items)}
    />
  );
}
