import { Box } from '@mantine/core';
import clsx from 'clsx';
import React from 'react';
import { Link } from 'react-router-dom';
import { getPageRoute, getPageTitleFixed } from 'src/renderer/helpers/miscs';
import {
  selectCurrentTreeNodeRelated,
  usePageStore,
} from 'src/renderer/store/usePageStore';

const SubpageLinks: React.FC<{}> = () => {
  const currentTreeNodeRelated = usePageStore(selectCurrentTreeNodeRelated);
  if (!currentTreeNodeRelated) {
    return null;
  }
  const { childrenNodes } = currentTreeNodeRelated;
  return (
    <Box
      className={clsx(
        'prose',
        'prose-a:text-blue-800',
        'prose-a:no-underline',
        'prose-a:break-all',
        'hover:prose-a:underline'
      )}
    >
      <ul>
        {childrenNodes.map((n) => (
          <li key={n.id}>
            <Link to={getPageRoute(n.id)}>
              {n.isFolder ? '📁 ' : '📄 '}
              {getPageTitleFixed(n.title)}
            </Link>
          </li>
        ))}
      </ul>
    </Box>
  );
};

export default SubpageLinks;
