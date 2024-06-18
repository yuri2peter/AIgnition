import { ActionIcon, Menu } from '@mantine/core';
import { openContextModal } from '@mantine/modals';
import {
  IconInfoCircle,
  IconMenu2,
  IconSettings,
  IconLogout,
} from '@tabler/icons-react';
import React from 'react';

const HeaderActions: React.FC<{}> = () => {
  return (
    <Menu trigger="click-hover" openDelay={100} closeDelay={400}>
      <Menu.Target>
        <ActionIcon variant="subtle" color="gray">
          <IconMenu2 stroke={1.5} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown miw={200}>
        <Menu.Item
          leftSection={<IconSettings size={16} stroke={1.5} />}
          onClick={() => {
            openContextModal({
              modal: 'SettingsModal',
              title: 'Settings',
              innerProps: {},
            });
          }}
        >
          Settings
        </Menu.Item>
        <Menu.Item leftSection={<IconInfoCircle size={16} stroke={1.5} />}>
          About
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item leftSection={<IconLogout size={16} stroke={1.5} />}>
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default HeaderActions;
