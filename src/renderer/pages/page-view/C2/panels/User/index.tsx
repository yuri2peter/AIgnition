import { Button, Stack, Text } from '@mantine/core';
import { IconBulb, IconLogout } from '@tabler/icons-react';
import React, { useState } from 'react';
import FlexGrow from 'src/renderer/components/miscs/FlexGrow';
import { logout, useUserStore } from 'src/renderer/store/useUserStore';
import PoweredBy from '../../../miscs/PoweredBy';
import LoginForm from './LoginForm';
import UpdatePasswordForm from './UpdatePasswordForm';
import Other from './Other';

const buttonProps = {
  variant: 'light',
};

const UserPanel: React.FC<{}> = () => {
  const { loggedIn } = useUserStore();
  const [showLoggedInMore, setLoggedInMore] = useState(false);
  const isNewInstance = useUserStore((s) => s.isNewInstance);
  const showMore = isNewInstance || showLoggedInMore;
  return (
    <Stack p={16} gap={32} h={'100%'}>
      {loggedIn ? (
        <>
          <Stack>
            <Text fw={'bold'}>Admin logged in</Text>
            <Button
              {...buttonProps}
              variant="fill"
              leftSection={<IconLogout size={16} stroke={1.5} />}
              onClick={() => {
                logout();
              }}
            >
              Logout
            </Button>
            {!showMore && (
              <Button
                variant="subtle"
                onClick={() => setLoggedInMore(true)}
                leftSection={<IconBulb size={16} stroke={1.5} />}
              >
                More actions
              </Button>
            )}
          </Stack>
          {showMore && (
            <>
              <UpdatePasswordForm />
              <Other />
            </>
          )}
        </>
      ) : (
        <LoginForm />
      )}
      <FlexGrow />
      <PoweredBy />
    </Stack>
  );
};

export default UserPanel;
