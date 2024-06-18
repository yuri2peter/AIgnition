import { ActionIcon, TextInput, Tooltip } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import React, { useRef, useState } from 'react';
import { uploadFileFromBrowser } from 'src/common/utils/file';
import { FileUploader } from 'src/renderer/helpers/FileUploader';
import { apiErrorHandler } from 'src/renderer/helpers/api';

const TextInputWithUploader: React.FC<
  React.ComponentProps<typeof TextInput> & {
    accept?: string;
  }
> = ({ accept, ...textInputprops }) => {
  const [loading, setLoading] = useState(false);
  const refInput = useRef<HTMLInputElement>(null);
  const handleUploadClick = async () => {
    setLoading(true);
    try {
      const file = await uploadFileFromBrowser(accept).catch(() => {
        return null;
      });
      if (!file) {
        setLoading(false);
        return;
      }
      const uploader = new FileUploader({ file });
      const { url } = await uploader.upload();
      const input = refInput.current;
      if (input) {
        // trigger onChange
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          input.constructor.prototype,
          'value'
        )!.set!;
        nativeInputValueSetter.call(input, url);
        const e = new Event('input', { bubbles: true });
        input.dispatchEvent(e);
      }
    } catch (error) {
      apiErrorHandler(error);
    }
    setLoading(false);
  };
  return (
    <TextInput
      ref={refInput}
      rightSection={
        <Tooltip label="Upload">
          <ActionIcon
            variant="subtle"
            loading={loading}
            onClick={handleUploadClick}
          >
            <IconUpload size={16} />
          </ActionIcon>
        </Tooltip>
      }
      {...textInputprops}
    />
  );
};

export default TextInputWithUploader;
