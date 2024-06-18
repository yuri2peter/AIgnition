import React, { useEffect, useState } from 'react';
import {
  ActionIcon,
  Anchor,
  Button,
  Checkbox,
  Group,
  LoadingOverlay,
  Stack,
  TextInput,
  Tooltip,
  Text,
} from '@mantine/core';
import { ContextModalProps } from '@mantine/modals';
import { useForm, zodResolver } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconStethoscope } from '@tabler/icons-react';
import { SettingsSchema } from 'src/common/type/settings';
import { apiErrorHandler, api } from 'src/renderer/helpers/api';
import { useAllSettingsStore } from 'src/renderer/store/useAllSettingsStore';
import TextInputWithUploader from '../../miscs/TextInputWithUploader';

const SettingsModal = ({ context, id }: ContextModalProps<{}>) => {
  const [checking1, setChecking1] = useState(false);
  const settings = useAllSettingsStore((s) => s.settings);
  const { pullAllSettings, pushAllSettings, clearLocalSettings } =
    useAllSettingsStore((s) => s.actions);
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: SettingsSchema.parse({}),
    validate: zodResolver(SettingsSchema),
  });
  const [loading, setLoading] = useState(true);
  const { setValues, setInitialValues } = form;
  useEffect(() => {
    pullAllSettings()
      .then(() => {
        setLoading(false);
      })
      .catch(apiErrorHandler);
    return () => {
      clearLocalSettings();
    };
  }, [clearLocalSettings, pullAllSettings]);
  useEffect(() => {
    setValues(settings);
    setInitialValues(settings);
  }, [setInitialValues, setValues, settings]);
  return (
    <>
      <LoadingOverlay visible={loading} />
      <form
        onSubmit={form.onSubmit(async (values) => {
          pushAllSettings(values)
            .then(() => {
              notifications.show({
                message: 'Settings saved',
                color: 'green',
              });
              context.closeModal(id);
            })
            .catch(apiErrorHandler);
        })}
      >
        <Stack gap="48px" maw={400}>
          <Stack gap="md" id="general">
            <Text size="lg" fw={'bold'}>
              General
            </Text>
            <Text size="sm" c={'gray'} mt={-16}>
              General settings for your site.
            </Text>
            <TextInput
              spellCheck={false}
              label="Site Name"
              key={form.key('general.siteName')}
              {...form.getInputProps('general.siteName')}
            />
            <TextInputWithUploader
              accept="image/*"
              spellCheck={false}
              label="Site Logo"
              key={form.key('general.siteLogo')}
              {...form.getInputProps('general.siteLogo')}
            />
          </Stack>
          <Stack gap="md" id="comment">
            <Text size="lg" fw={'bold'}>
              Comment System
            </Text>
            <Text size="sm" c={'gray'} mt={-16}>
              <Anchor
                href="https://giscus.app/"
                c="blue"
                underline="hover"
                style={{
                  fontSize: 'inherit',
                }}
              >
                Giscus
              </Anchor>{' '}
              comment system configurations.
            </Text>
            <Checkbox
              label="Enabled"
              key={form.key('giscus.enabled')}
              {...form.getInputProps('giscus.enabled', { type: 'checkbox' })}
            />
            <TextInput
              spellCheck={false}
              label="Repo"
              key={form.key('giscus.repo')}
              {...form.getInputProps('giscus.repo')}
            />
            <TextInput
              spellCheck={false}
              label="Repo Id"
              key={form.key('giscus.repoId')}
              {...form.getInputProps('giscus.repoId')}
            />
            <TextInput
              spellCheck={false}
              label="Category"
              key={form.key('giscus.category')}
              {...form.getInputProps('giscus.category')}
            />
            <TextInput
              spellCheck={false}
              label="Category Id"
              key={form.key('giscus.categoryId')}
              {...form.getInputProps('giscus.categoryId')}
            />
          </Stack>
          <Stack gap="md" id="ai">
            <Text size="lg" fw={'bold'}>
              AI
            </Text>
            <Text size="sm" c={'gray'} mt={-16}>
              AI assistant configurations.
            </Text>
            <Checkbox
              label="Enabled"
              key={form.key('ai.enabled')}
              {...form.getInputProps('ai.enabled', { type: 'checkbox' })}
            />
            <TextInput
              // type="password"
              spellCheck={false}
              placeholder=""
              label="Gemini AI Key"
              description={
                <>
                  The secret key could be applied from{' '}
                  <Anchor
                    href="https://makersuite.google.com/app/apikey"
                    c="blue"
                    underline="hover"
                    style={{
                      fontSize: 'inherit',
                    }}
                  >
                    here.
                  </Anchor>
                </>
              }
              rightSection={
                <Tooltip label="Check availability">
                  <ActionIcon
                    variant="subtle"
                    loading={checking1}
                    onClick={() => {
                      setChecking1(true);
                      api()
                        .post('/api/settings/check-ai-key', {
                          key: form.getValues().ai.geminiKey,
                        })
                        .then(({ data: { ok, error } }) => {
                          if (ok) {
                            notifications.show({
                              message: 'Gemini AI Key available.',
                              color: 'green',
                            });
                          } else {
                            notifications.show({
                              message: error,
                              color: 'red',
                              autoClose: false,
                            });
                          }
                        })
                        .catch(apiErrorHandler)
                        .finally(() => {
                          setChecking1(false);
                        });
                    }}
                  >
                    <IconStethoscope size={16} />
                  </ActionIcon>
                </Tooltip>
              }
              key={form.key('ai.geminiKey')}
              {...form.getInputProps('ai.geminiKey')}
            />
          </Stack>
          <Group mt="lg">
            <Button
              variant="outline"
              color="gray"
              ml="auto"
              onClick={async () => {
                context.closeModal(id);
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </Group>
        </Stack>
      </form>
    </>
  );
};
export default SettingsModal;
