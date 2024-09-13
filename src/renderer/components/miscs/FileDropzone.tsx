import { Group, Text, rem } from '@mantine/core';
import { IconUpload, IconX, IconFile } from '@tabler/icons-react';
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone';

const IconSize = 52;

function FileDropzone({
  mih = 180,
  title1 = 'Drag files here or click to select files',
  title2 = 'Attach as many files as you like, each file should not exceed 5mb',
  maxSize = 5 * 1024 ** 2,
  accept = IMAGE_MIME_TYPE,
  onDrop = (files) => console.log('accepted files', files),
  onReject = (files) => console.log('rejected files', files),
  ...props
}: Partial<DropzoneProps> & {
  title1?: string;
  title2?: string;
}) {
  return (
    <Dropzone
      onDrop={onDrop}
      onReject={onReject}
      maxSize={maxSize}
      accept={accept}
      {...props}
    >
      <Group
        justify="center"
        gap="md"
        mih={mih}
        wrap="nowrap"
        style={{ pointerEvents: 'none' }}
      >
        <Dropzone.Accept>
          <IconUpload
            style={{
              width: rem(IconSize),
              height: rem(IconSize),
              color: 'var(--mantine-color-blue-6)',
            }}
            stroke={1.5}
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX
            style={{
              width: rem(IconSize),
              height: rem(IconSize),
              color: 'var(--mantine-color-red-6)',
            }}
            stroke={1.5}
          />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconFile
            style={{
              width: rem(IconSize),
              height: rem(IconSize),
              color: 'var(--mantine-color-dimmed)',
            }}
            stroke={1.5}
          />
        </Dropzone.Idle>

        <div>
          <Text size="xl" inline>
            {title1}
          </Text>
          <Text size="sm" c="dimmed" inline mt={7}>
            {title2}
          </Text>
        </div>
      </Group>
    </Dropzone>
  );
}

export default FileDropzone;
