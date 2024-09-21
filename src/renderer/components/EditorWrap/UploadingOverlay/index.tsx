import { Box, Card, Group, LoadingOverlay, Stack, Text } from '@mantine/core';
import React from 'react';
import { useUploadingOverlayStore } from './store';
import { bytesToSize, getFileExtension } from 'src/common/utils/string';
import { defaultStyles, FileIcon } from 'react-file-icon';

const UploadingOverlay: React.FC<{}> = () => {
  const uploading = useUploadingOverlayStore((s) => s.uploading);
  return (
    <LoadingOverlay
      visible={uploading}
      zIndex={2}
      overlayProps={{ blur: 4, backgroundOpacity: 0.1, color: '#000' }}
      loaderProps={{ children: <UploadingLoader /> }}
    />
  );
};

const UploadingLoader: React.FC<{}> = () => {
  const fileInfos = useUploadingOverlayStore((s) => s.fileInfos);
  return (
    <Card withBorder shadow="md">
      <Stack>
        {fileInfos.map((info, index) => {
          const ext = getFileExtension(info.name ?? '');
          return (
            <Stack key={index} gap={0}>
              <Group gap={'xs'}>
                <Box w={'1em'}>
                  <FileIcon
                    extension={ext}
                    {...defaultStyles[ext as keyof typeof defaultStyles]}
                  />
                </Box>
                <Text key={index} size={'md'}>
                  {info.name}
                </Text>
              </Group>
              <Text key={index} size={'sm'} c="gray">
                {bytesToSize(info.loaded)} / {bytesToSize(info.total)} (
                {Math.floor(info.progress)}%)
              </Text>
            </Stack>
          );
        })}
      </Stack>
    </Card>
  );
};

export default UploadingOverlay;
