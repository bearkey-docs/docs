import OriginalMDXComponents from '@theme-original/MDXComponents';
import AutoDocCardList from '@site/src/components/AutoDocCardList';

const MDXComponents = {
  ...OriginalMDXComponents,
  DocCardList: AutoDocCardList,
};

export default MDXComponents;
