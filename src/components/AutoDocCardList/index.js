import React from 'react';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import ThemeDocCardList from '@theme/DocCardList';
import splitDocCardItems from '@site/src/generated/splitDocCardItems.json';

export default function AutoDocCardList(props) {
  const {frontMatter} = useDoc();
  const generatedSourceId = frontMatter.generated_from_split_doc;
  const generatedItems =
    !props.items && generatedSourceId
      ? splitDocCardItems[generatedSourceId]
      : undefined;

  return <ThemeDocCardList {...props} items={props.items ?? generatedItems} />;
}
