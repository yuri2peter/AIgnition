import { ActionIcon, Group, Stack } from '@mantine/core';
import React from 'react';
import PageNav from './PageNav';
import {
  IconFile,
  IconSearch,
  IconSettings,
  IconUser,
} from '@tabler/icons-react';
import FlexGrow from 'src/renderer/components/miscs/FlexGrow';
import { useLeftsideStore } from 'src/renderer/store/useLeftsideStore';
import Settings from './Settings';

const Sections: React.FC<{}> = () => {
  const sid = useLeftsideStore((s) => s.activedSectionId);
  const { setActivedSectionId } = useLeftsideStore((s) => s.actions);
  return (
    <Group
      style={{ overflow: 'auto', flexGrow: 1, flexShrink: 0 }}
      align="stretch"
      gap={0}
      wrap="nowrap"
    >
      <Stack
        p={8}
        style={{ borderRight: '1px solid var(--mantine-color-gray-3)' }}
      >
        <ActionIcon
          {...getIconProps(sid === 'pages')}
          onClick={() => setActivedSectionId('pages')}
        >
          <IconFile size={20} stroke={1.5} />
        </ActionIcon>
        <ActionIcon
          {...getIconProps(sid === 'search')}
          onClick={() => setActivedSectionId('search')}
        >
          <IconSearch size={20} stroke={1.5} />
        </ActionIcon>
        <FlexGrow />
        <ActionIcon
          {...getIconProps(sid === 'user')}
          onClick={() => setActivedSectionId('user')}
        >
          <IconUser size={20} stroke={1.5} />
        </ActionIcon>
        <ActionIcon
          {...getIconProps(sid === 'settings')}
          onClick={() => setActivedSectionId('settings')}
        >
          <IconSettings size={20} stroke={1.5} />
        </ActionIcon>
      </Stack>
      {sid === 'pages' && <PageNav />}
      {sid === 'settings' && <Settings />}
    </Group>
  );
};

function getIconProps(
  actived = false
): Partial<React.ComponentProps<typeof ActionIcon>> {
  if (actived) {
    return {
      variant: 'light',
      color: 'blue',
    };
  }
  return {
    variant: 'subtle',
    color: 'gray',
  };
}

export default Sections;
