import { Box, Group } from '@mantine/core';
import { IconChevronRight, IconPointFilled } from '@tabler/icons-react';
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
      <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
        {childrenNodes.map((n) => (
          <li key={n.id}>
            <Group>
              {n.isFolder ? (
                <IconChevronRight color="gray" size={16} stroke={1.5} />
              ) : (
                <IconPointFilled
                  color="var(--mantine-color-gray-2)"
                  size={16}
                  stroke={1.5}
                />
              )}

              <Link to={getPageRoute(n.id)}>{getPageTitleFixed(n.title)}</Link>
            </Group>
          </li>
        ))}
      </ul>
    </Box>
  );
};

export default SubpageLinks;
