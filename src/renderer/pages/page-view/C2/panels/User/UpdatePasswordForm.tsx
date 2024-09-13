import {
  Stack,
  TextInput,
  Button,
  Text,
  PasswordInput,
  Group,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { IconAlertTriangleFilled, IconCheck } from '@tabler/icons-react';
import React from 'react';
import { passwordHasher } from 'src/common/libs/authTools';
import { passwordSchema } from 'src/common/type/auth';
import { updatePassword, useUserStore } from 'src/renderer/store/useUserStore';
import { z } from 'zod';

const UpdatePasswordForm: React.FC = () => {
  const isNewInstance = useUserStore((s) => s.isNewInstance);
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validate: zodResolver(
      z
        .object({
          password: passwordSchema,
          confirmPassword: passwordSchema,
        })
        .superRefine(({ confirmPassword, password }, ctx) => {
          if (confirmPassword !== password) {
            ctx.addIssue({
              code: 'custom',
              message: 'The passwords did not match',
              path: ['confirmPassword'],
            });
          }
        })
    ),
  });
  const hiddenUserInput = (
    <TextInput type="hidden" value={'AIgnition Admin'} name="username" />
  );
  return (
    <form
      onSubmit={form.onSubmit(async (values) => {
        updatePassword(passwordHasher(values.password)).then(() => {
          form.reset();
        });
      })}
    >
      <Stack>
        <Group gap={'sm'}>
          {isNewInstance && <IconAlertTriangleFilled color="red" />}
          <Text fw={'bold'}>Update password</Text>
        </Group>
        {isNewInstance && (
          <Text c="red.6" size="sm">
            Empty password detected. Please update your password!
          </Text>
        )}
        {hiddenUserInput}
        <PasswordInput
          type="password"
          placeholder="New password"
          key={form.key('password')}
          {...form.getInputProps('password')}
        />
        <PasswordInput
          type="password"
          placeholder="Confirm password"
          key={form.key('confirmPassword')}
          {...form.getInputProps('confirmPassword')}
        />
        <Button
          variant="light"
          type="submit"
          leftSection={<IconCheck size={16} />}
        >
          Submit
        </Button>
      </Stack>
    </form>
  );
};

export default UpdatePasswordForm;
