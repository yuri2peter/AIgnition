import { Stack, TextInput, Button, Text, PasswordInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { IconLogin, IconLock, IconBulb } from '@tabler/icons-react';
import React, { useState } from 'react';
import { passwordHasher } from 'src/common/libs/authTools';
import { passwordSchema } from 'src/common/type/auth';
import {
  loginWithPasswordHashed,
  requestTempPassword,
} from 'src/renderer/store/useUserStore';
import { z } from 'zod';

const LoginForm: React.FC<{}> = () => {
  const [showLoginHint, setShowLoginHint] = useState(false);
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      password: '',
    },
    validate: zodResolver(
      z.object({
        password: passwordSchema,
      })
    ),
  });
  const hiddenUserInput = (
    <TextInput type="hidden" value={'AIgnition Admin'} name="username" />
  );
  return (
    <form
      onSubmit={form.onSubmit(async (values) => {
        loginWithPasswordHashed(passwordHasher(values.password));
      })}
    >
      <Stack>
        <Text fw={'bold'}>Access your account</Text>
        {hiddenUserInput}
        <PasswordInput
          placeholder="Enter Password"
          key={form.key('password')}
          {...form.getInputProps('password')}
        />
        <Button
          type="submit"
          variant="fill"
          leftSection={<IconLogin size={16} />}
        >
          Login
        </Button>
        {showLoginHint ? (
          <>
            <Text c="gray.6" size="sm">
              You could use the temporary password to log in instead.
            </Text>
            <Text c="gray.6" size="sm">
              The temporary password will be printed in the console and log file
              when you request.
            </Text>
            <Button
              variant="subtle"
              onClick={requestTempPassword}
              leftSection={<IconLock size={16} stroke={1.5} />}
            >
              Request a temporary password
            </Button>
          </>
        ) : (
          <Button
            variant="subtle"
            onClick={() => setShowLoginHint(true)}
            leftSection={<IconBulb size={16} stroke={1.5} />}
          >
            Forgot password?
          </Button>
        )}
      </Stack>
    </form>
  );
};

export default LoginForm;
