import { z } from 'zod';
import { api } from './api';
import { zodSafeString, zodSafeNumber } from 'src/common/utils/type';

export const UploadResultSchema = z.object({
  newFilename: zodSafeString(),
  originalFilename: zodSafeString(),
  mimetype: zodSafeString(),
  size: zodSafeNumber(),
  url: zodSafeString(),
});

export type UploadResult = z.infer<typeof UploadResultSchema>;

type HandleUploadProgress = (eventData: {
  loaded: number;
  total: number;
  progress: number;
}) => void;
export interface FileUploaderProps {
  file: File;
  onUploadProgress?: HandleUploadProgress;
}
export class FileUploader implements FileUploaderProps {
  abortCtrl = new AbortController();
  file: File;
  onUploadProgress: HandleUploadProgress = () => {};
  constructor(props: FileUploaderProps) {
    this.file = props.file;
    Object.assign(this, props);
  }

  async upload() {
    const formData = new FormData();
    formData.append('file', this.file);
    const { data } = await api().post('/api/miscs/upload', formData, {
      signal: this.abortCtrl.signal,
      onUploadProgress: ({ loaded, total }) => {
        const progress = (loaded / (total || 1)) * 100;
        this.onUploadProgress({ loaded, total: total || 0, progress });
      },
    });
    return UploadResultSchema.parse(data);
  }

  abort() {
    this.abortCtrl.abort();
  }
}
