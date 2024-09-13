import React, { useState } from 'react';
import { ContextModalProps, modals, openContextModal } from '@mantine/modals';
import { Box, Button, Group, Stack, Text } from '@mantine/core';
import FileDropzone from 'src/renderer/components/miscs/FileDropzone';
import { FileWithPath } from '@mantine/dropzone';
import { api } from 'src/renderer/helpers/api';
import FlexGrow from 'src/renderer/components/miscs/FlexGrow';

export const ImportFromArchiveModal = ({
  context,
  id,
}: ContextModalProps<{}>) => {
  const [processing, setProcessing] = useState(false);
  const [file, setFile] = useState<FileWithPath>();
  const dataReady = !!file;
  return (
    <Stack>
      {dataReady ? (
        <Text>The file is ready to be imported.</Text>
      ) : (
        <>
          <FileDropzone
            maxFiles={1}
            onDrop={(files) => {
              const firstFile = files[0];
              if (firstFile) {
                setFile(firstFile);
              }
            }}
            accept={['application/zip']}
            title1="Drag file here or click to select file"
            title2="The file should be in zip format. Example: archive.zip"
          />
          <Text size="sm" c={'gray.6'}>
            This action will replace all current pages and settings with the
            data in the zip file.
          </Text>
        </>
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
            const formData = new FormData();
            formData.append('file', file!);
            await api().post('/api/miscs/import-archive', formData);
            setProcessing(false);
            context.closeModal(id);
            modals.open({
              title: 'Action performed',
              children: (
                <Box>
                  <Text>
                    Data imported successfully! The app will now reload.
                  </Text>
                  <Group mt="lg">
                    <FlexGrow />
                    <Button
                      onClick={() => {
                        modals.closeAll();
                      }}
                    >
                      OK
                    </Button>
                  </Group>
                </Box>
              ),
              onClose() {
                window.location.reload();
              },
            });
          }}
        >
          Import
        </Button>
      </Group>
    </Stack>
  );
};

export function openImportFromArchiveModal() {
  openContextModal({
    modal: 'ImportFromArchiveModal',
    title: 'Import data from archive',
    size: 'lg',
    innerProps: {},
  });
}
