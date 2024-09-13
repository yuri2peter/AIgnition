import { Stack } from '@mantine/core';
import { useContextMenu } from 'mantine-contextmenu';
import React from 'react';
import { ComputedPage } from 'src/common/type/page';
import { navigate } from 'src/renderer/hacks/navigate';
import { getPageRoute } from 'src/renderer/helpers/miscs';
import { usePageStore } from 'src/renderer/store/usePageStore';
import { openPageActionsMenu } from './openPageActionsMenu';
import NavItemLite from './NavItemLite';

const NavItemListLite: React.FC<{
  items: ComputedPage[];
}> = ({ items }) => {
  const currentPageId = usePageStore((s) => s.currentPageId);
  const { showContextMenu } = useContextMenu();
  return (
    <Stack gap={2} component={'ul'}>
      {items.map((t) => (
        <NavItemLite
          key={t.id}
          item={t}
          selected={currentPageId === t.id}
          buttonProps={{
            onClick: () => {
              navigate(getPageRoute(t.id));
            },
            onContextMenu: (e) => {
              openPageActionsMenu({
                itemId: t.id,
                showContextMenu,
                event: e,
              });
            },
          }}
        />
      ))}
    </Stack>
  );
};

export default NavItemListLite;
