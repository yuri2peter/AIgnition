import {
  Button,
  Group,
  NumberInput,
  Stack,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import React from 'react';
import { WebWidgets, WebWidgetsSchema } from './defines';

const Form: React.FC<{
  initialValues: WebWidgets;
  onSubmit: (value: WebWidgets) => void;
  onCancel: () => void;
}> = ({ initialValues, onSubmit, onCancel }) => {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues,
    validate: zodResolver(WebWidgetsSchema),
  });
  return (
    <form
      onSubmit={form.onSubmit((values) => {
        onSubmit(values);
      })}
    >
      <Stack>
        <Group wrap="nowrap">
          <TextInput
            autoComplete="new-password"
            data-autofocus
            label={'Name'}
            required
            key={form.key('name')}
            {...form.getInputProps('name')}
          />
          <NumberInput
            label={'Height'}
            placeholder="Frame height (px)"
            required
            key={form.key('height')}
            {...form.getInputProps('height')}
          />
        </Group>

        <Textarea
          label={'Content'}
          spellCheck={false}
          minRows={3}
          maxRows={12}
          required
          autosize
          placeholder="URL or html codes"
          key={form.key('content')}
          {...form.getInputProps('content')}
        />

        <Group mt="lg">
          <Button variant="outline" color="gray" ml="auto" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Submit</Button>
        </Group>
      </Stack>
    </form>
  );
};

export default Form;
