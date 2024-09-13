import { Button, Stack, Text } from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';
import React from 'react';
import { logoutOtherDevices } from 'src/renderer/store/useUserStore';

const Other: React.FC<{}> = () => {
  return (
    <Stack>
      <Text fw={'bold'}>Other</Text>
      <Button
        variant="light"
        leftSection={<IconLogout size={16} />}
        onClick={logoutOtherDevices}
      >
        Logout other devices
      </Button>
    </Stack>
  );
};

export default Other;
