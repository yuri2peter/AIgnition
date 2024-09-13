import React from 'react';
import { Breadcrumbs, Anchor } from '@mantine/core';
import {
  selectCurrentTreeNodeRelated,
  usePageStore,
} from 'src/renderer/store/usePageStore';
import { Link } from 'react-router-dom';
import { getPageRoute, getPageTitleFixed } from 'src/renderer/helpers/miscs';

const PageBreadcrumbs: React.FC<{}> = () => {
  const currentTreeNodeRelated = usePageStore(selectCurrentTreeNodeRelated);
  if (
    !currentTreeNodeRelated ||
    currentTreeNodeRelated.ancestorsNodes.length === 0
  ) {
    return null;
  }

  return (
    <Breadcrumbs
      separator="/"
      separatorMargin="md"
      my={12}
      style={{ flexWrap: 'wrap' }}
    >
      {currentTreeNodeRelated.ancestorsNodes.map((item) => (
        <Anchor to={getPageRoute(item.id)} key={item.id} component={Link}>
          {getPageTitleFixed(item.title)}
        </Anchor>
      ))}
      Current
    </Breadcrumbs>
  );
};

export default PageBreadcrumbs;
