import {
  ActionIcon,
  Button,
  Group,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { ContextModalProps } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconRobot } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { Page, PageCustomIdSchema, PageSchema } from 'src/common/type/page';
import { api, apiErrorHandler } from 'src/renderer/helpers/api';
import {
  selectAiEnabled,
  useNonSensitiveSettingsStore,
} from 'src/renderer/store/useNonSensitiveSettingsStore';
import { usePageStore } from 'src/renderer/store/usePageStore';
import { z } from 'zod';

const ChangePageIdModal = ({
  context,
  id,
  innerProps,
}: ContextModalProps<{ from: string }>) => {
  const aiEnabled = useNonSensitiveSettingsStore(selectAiEnabled);
  const [checking1, setChecking1] = useState(false);
  const { changeId } = usePageStore((s) => s.actions);
  const { from } = innerProps;
  const [page, setPage] = useState<null | Page>(null);
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { id: from },
    validate: zodResolver(
      z.object({
        id: PageCustomIdSchema.refine((id) => id !== from, {
          message: 'new id cannot be same as old id',
        }),
      })
    ),
  });
  const canUseAiSuggestion = aiEnabled && page?.content;
  useEffect(() => {
    api()
      .post('/api/page/get-item', { id: from })
      .then(({ data }) => {
        setPage(PageSchema.parse(data));
      });
  }, [from]);
  return (
    <form
      onSubmit={form.onSubmit(async (values) => {
        changeId({ from, to: values.id })
          .then(() => {
            notifications.show({
              message: 'Route changed successfully',
              color: 'green',
            });
            context.closeModal(id);
          })
          .catch(apiErrorHandler);
      })}
    >
      <Stack>
        <TextInput
          spellCheck={false}
          label="Page route"
          placeholder="route can only contain A-Z, a-z, 0-9, -, _"
          data-autofocus
          rightSection={
            canUseAiSuggestion && (
              <Tooltip label="AI suggestion">
                <ActionIcon
                  variant="subtle"
                  loading={checking1}
                  onClick={() => {
                    setChecking1(true);
                    api()
                      .post('/api/ai/page-id-suggestion', {
                        content: page?.content,
                      })
                      .then(({ data }) => {
                        const { suggestion } = z
                          .object({
                            suggestion: z.string(),
                          })
                          .parse(data);
                        form.setFieldValue('id', suggestion);
                      })
                      .catch(apiErrorHandler)
                      .finally(() => {
                        setChecking1(false);
                      });
                  }}
                >
                  <IconRobot size={16} />
                </ActionIcon>
              </Tooltip>
            )
          }
          key={form.key('id')}
          {...form.getInputProps('id')}
        />
        {page?.content && (
          <Text lineClamp={3} size="sm" c="gray">
            {page?.content}
          </Text>
        )}
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
  );
};

export default ChangePageIdModal;
