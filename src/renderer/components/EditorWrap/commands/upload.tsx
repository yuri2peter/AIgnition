import { IconUpload } from '@tabler/icons-react';
import { uploadFileFromBrowser } from 'src/common/utils/file';
import { ICommand } from 'src/renderer/components/ReactMD';
import { svgIconProps } from 'src/renderer/components/ReactMD/commands/defines';
import { insertFilesIntoEditor } from '../utils';

export const upload: ICommand = {
  name: 'Upload',
  keyCommand: 'upload',
  title: 'Upload images and files',
  icon: <IconUpload {...svgIconProps} />,
  execute: async (state, api) => {
    const files = await uploadFileFromBrowser(true);
    insertFilesIntoEditor(files, api);
  },
};
