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
  Box,
  Textarea,
  Radio,
  Autocomplete,
  PasswordInput,
  NativeSelect,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  IconCheck,
  IconStethoscope,
  IconArrowBackUp,
} from '@tabler/icons-react';
import { SettingsSchema } from 'src/common/type/settings';
import { apiErrorHandler, api } from 'src/renderer/helpers/api';
import { useAllSettingsStore } from 'src/renderer/store/useAllSettingsStore';
import TextInputWithUploader from 'src/renderer/components/miscs/TextInputWithUploader';
import {
  selectPublicFolders,
  usePageStore,
} from 'src/renderer/store/usePageStore';
import { getPageTitleFixed } from 'src/renderer/helpers/miscs';

const Settings = () => {
  const [checking1, setChecking1] = useState(false);
  const settings = useAllSettingsStore((s) => s.settings);
  const publicFolders = usePageStore(selectPublicFolders);
  const { pullAllSettings, pushAllSettings, clearLocalSettings } =
    useAllSettingsStore((s) => s.actions);
  const form = useForm({
    mode: 'controlled',
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
    <Box pos={'relative'} h={'100%'}>
      <LoadingOverlay visible={loading} zIndex={50} />
      <form
        style={{ height: '100%' }}
        onSubmit={form.onSubmit(async (values) => {
          pushAllSettings(values)
            .then(() => {
              notifications.show({
                message: 'Settings saved',
                color: 'green',
              });
            })
            .catch(apiErrorHandler);
        })}
      >
        <Stack p={16} pb={0} gap={32} style={{ overflow: 'auto' }} h={'100%'}>
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
            <NativeSelect
              label="Default public folder"
              description="Default folder when guest access the home page."
              key={form.key('general.defaultPublicFolder')}
              {...form.getInputProps('general.defaultPublicFolder')}
              data={[
                {
                  value: '',
                  label: 'Disabled',
                },
                ...(publicFolders.some(
                  (t) => t.id === settings.general.defaultPublicFolder
                )
                  ? []
                  : [
                      {
                        value: settings.general.defaultPublicFolder,
                        label:
                          settings.general.defaultPublicFolder + ' (Not found)',
                      },
                    ]),
                ...publicFolders.map((t) => ({
                  value: t.id,
                  label: getPageTitleFixed(t.title),
                })),
              ]}
            />
            <TextInput
              spellCheck={false}
              placeholder=""
              label="Proxy Url"
              description={
                'Uses a proxy server for all API requests. The actual URL will be formatted as `https://your_proxy/http://example.com`.'
              }
              key={form.key('general.proxyUrl')}
              {...form.getInputProps('general.proxyUrl')}
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
                target="_blank"
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
            {form.values.giscus.enabled && (
              <>
                <TextInput
                  spellCheck={false}
                  label="Repo"
                  key={form.key('giscus.repo')}
                  {...form.getInputProps('giscus.repo')}
                />
                <PasswordInput
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
                <PasswordInput
                  label="Category Id"
                  key={form.key('giscus.categoryId')}
                  {...form.getInputProps('giscus.categoryId')}
                />
              </>
            )}
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
            {form.values.ai.enabled && (
              <>
                <Checkbox
                  label="QPM limited"
                  description="Limit queries per minute to 15 (recommended)."
                  key={form.key('ai.qpmLimited')}
                  {...form.getInputProps('ai.qpmLimited', {
                    type: 'checkbox',
                  })}
                />
                <Radio.Group
                  label="Engine"
                  description="Select the AI engine to use."
                  key={form.key('ai.engine')}
                  {...form.getInputProps('ai.engine')}
                >
                  <Group mt="xs">
                    <Radio value="gemini" label="Gemini" />
                    <Radio value="openai" label="OpenAI" />
                  </Group>
                </Radio.Group>
                {form.values.ai.engine === 'gemini' && (
                  <>
                    <PasswordInput
                      placeholder=""
                      label="Gemini API Key"
                      description={
                        <>
                          The secret key could be applied from{' '}
                          <Anchor
                            href="https://makersuite.google.com/app/apikey"
                            c="blue"
                            target="_blank"
                            underline="hover"
                            style={{
                              fontSize: 'inherit',
                            }}
                          >
                            here.
                          </Anchor>
                        </>
                      }
                      leftSectionPointerEvents="all"
                      leftSection={
                        <Tooltip label="Check availability">
                          <ActionIcon
                            variant="subtle"
                            loading={checking1}
                            onClick={() => {
                              setChecking1(true);
                              api()
                                .post('/api/settings/check-gemini-key', {
                                  key: form.getValues().ai.geminiKey,
                                  baseURL: form.getValues().ai.geminiBaseUrl,
                                })
                                .then(({ data: { ok, error } }) => {
                                  if (ok) {
                                    notifications.show({
                                      message: 'Gemini API Key available.',
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
                    <TextInput
                      spellCheck={false}
                      label="Gemini API Base Url"
                      description={'Custom base URL for Gemini AI requests.'}
                      key={form.key('ai.geminiBaseUrl')}
                      {...form.getInputProps('ai.geminiBaseUrl')}
                    />
                    <Autocomplete
                      label="Model"
                      filter={({ options }) => options}
                      data={[
                        'gemini-1.5-flash',
                        'gemini-1.5-pro',
                        'gemini-pro',
                      ]}
                      key={form.key('ai.geminiModel')}
                      {...form.getInputProps('ai.geminiModel')}
                    />
                  </>
                )}
                {form.values.ai.engine === 'openai' && (
                  <>
                    <PasswordInput
                      placeholder=""
                      label="OpenAI API Key"
                      description={
                        <>
                          The secret key could be applied from{' '}
                          <Anchor
                            href="https://platform.openai.com/api-keys"
                            target="_blank"
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
                      leftSectionPointerEvents="all"
                      leftSection={
                        <Tooltip label="Check availability">
                          <ActionIcon
                            variant="subtle"
                            loading={checking1}
                            onClick={() => {
                              setChecking1(true);
                              api()
                                .post('/api/settings/check-openai-key', {
                                  key: form.getValues().ai.openaiKey,
                                  baseURL: form.getValues().ai.openaiBaseUrl,
                                })
                                .then(({ data: { ok, error } }) => {
                                  if (ok) {
                                    notifications.show({
                                      message: 'OpenAI API Key available.',
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
                      key={form.key('ai.openaiKey')}
                      {...form.getInputProps('ai.openaiKey')}
                    />
                    <TextInput
                      spellCheck={false}
                      label="OpenAI API Base Url"
                      description={'Custom base URL for OpenAI API requests.'}
                      key={form.key('ai.openaiBaseUrl')}
                      {...form.getInputProps('ai.openaiBaseUrl')}
                    />{' '}
                    <Autocomplete
                      label="Model"
                      filter={({ options }) => options}
                      data={[
                        'gpt-4o-mini',
                        'gpt-4o',
                        'gpt-4-turbo',
                        'gpt-3.5-turbo',
                      ]}
                      key={form.key('ai.openaiModel')}
                      {...form.getInputProps('ai.openaiModel')}
                    />
                  </>
                )}
              </>
            )}
          </Stack>
          <Stack gap="md" id="linkIconPreview">
            <Text size="lg" fw={'bold'}>
              Link icon preview
            </Text>
            <Text size="sm" c={'gray'} mt={-16}>
              Automatic hyperlink icon resolution and preview.
            </Text>
            <Checkbox
              label="Enabled"
              key={form.key('linkIconPreview.enabled')}
              {...form.getInputProps('linkIconPreview.enabled', {
                type: 'checkbox',
              })}
            />
            {form.values.linkIconPreview.enabled && (
              <>
                <Checkbox
                  label="Logged in users only"
                  key={form.key('linkIconPreview.loggedInOnly')}
                  {...form.getInputProps('linkIconPreview.loggedInOnly', {
                    type: 'checkbox',
                  })}
                />
                <Textarea
                  minRows={3}
                  maxRows={5}
                  spellCheck={false}
                  placeholder=".e.g. localhost"
                  label="Filters"
                  description={
                    <>
                      Enter keywords on separate lines to disable preview for
                      links containing those keywords.
                    </>
                  }
                  key={form.key('linkIconPreview.filters')}
                  {...form.getInputProps('linkIconPreview.filters')}
                />
              </>
            )}
          </Stack>
          <Group
            style={{
              zIndex: 2,
              position: 'sticky',
              bottom: 0,
              left: 0,
              background: 'var(--mantine-color-gray-0)',
            }}
            py={16}
          >
            <Button type="submit" leftSection={<IconCheck size={16} />}>
              Save
            </Button>
            <Button
              variant="outline"
              color="gray"
              leftSection={<IconArrowBackUp size={16} />}
              onClick={async () => {
                form.reset();
              }}
            >
              Reset
            </Button>
          </Group>
        </Stack>
      </form>
    </Box>
  );
};
export default Settings;
