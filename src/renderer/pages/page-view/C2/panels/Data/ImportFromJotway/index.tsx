import React, { useState } from 'react';
import { ContextModalProps, openContextModal } from '@mantine/modals';
import { Button, Group, Stack, Text } from '@mantine/core';
import { DataParsed, dataParser } from './dataParser';
import { dataInsert } from './dataInsert';
import { apiErrorHandler } from 'src/renderer/helpers/api';
import { notifications } from '@mantine/notifications';
import { usePageStore } from 'src/renderer/store/usePageStore';
import FileDropzone from 'src/renderer/components/miscs/FileDropzone';

export const ImportFromJotwayModal = ({
  context,
  id,
}: ContextModalProps<{}>) => {
  const [dataParsed, setDataParsed] = useState<DataParsed>([]);
  const [processing, setProcessing] = useState(false);
  const { pullPages } = usePageStore((s) => s.actions);
  const dataReady = dataParsed.length > 0;
  return (
    <Stack>
      {dataReady ? (
        processing ? (
          <Text>Processing...</Text>
        ) : (
          <Text>
            Categories loaded: {dataParsed.map((d) => d.tag).join(', ')}
          </Text>
        )
      ) : (
        <FileDropzone
          maxSize={1024 ** 3}
          maxFiles={1}
          onDrop={(files) => {
            const firstFile = files[0];
            if (firstFile) {
              firstFile.text().then((dataStr) => {
                try {
                  const data1 = JSON.parse(dataStr);
                  const data2 = dataParser(data1);
                  setDataParsed(data2);
                } catch (error) {
                  notifications.show({
                    color: 'red',
                    title: 'Error',
                    message: 'Invalid JSON format',
                  });
                }
              });
            }
          }}
          accept={['application/json']}
          title1="Drag file here or click to select file"
          title2="The file should be in JSON format. Example: jotway_record.json"
        />
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
        <Button
          disabled={!dataReady}
          loading={processing}
          onClick={async () => {
            setProcessing(true);
            await dataInsert(dataParsed)
              .then(() => {
                context.closeModal(id);
                notifications.show({
                  color: 'green',
                  title: 'Action performed',
                  message: 'Data imported successfully',
                });
              })
              .catch(apiErrorHandler);
            await pullPages();
            setProcessing(false);
          }}
        >
          Import
        </Button>
      </Group>
    </Stack>
  );
};

export const openImportFromJotwayModal = () => {
  openContextModal({
    modal: 'ImportFromJotwayModal',
    title: 'Import data from Jotway',
    size: 'lg',
    innerProps: {},
  });
};
