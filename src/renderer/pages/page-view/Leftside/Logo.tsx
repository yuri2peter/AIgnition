import { Group, Avatar, Text } from '@mantine/core';
import React from 'react';
import {
  useNonSensitiveSettingsStore,
  selectSiteName,
  selectSiteLogo,
} from 'src/renderer/store/useNonSensitiveSettingsStore';

const Main: React.FC<{}> = () => {
  const siteName = useNonSensitiveSettingsStore(selectSiteName);
  const siteLogo = useNonSensitiveSettingsStore(selectSiteLogo);
  return (
    <Group
      wrap="nowrap"
      px={16}
      style={{
        borderBottom: '1px solid var(--mantine-color-gray-3)',
        height: 56,
        flexShrink: 0,
      }}
    >
      <Avatar src={siteLogo} alt="Site logo" />
      <Text fw={700} c="gray" size="lg">
        {siteName}
      </Text>
    </Group>
  );
};

export default Main;
