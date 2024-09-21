import { createZustandStore } from 'src/common/libs/createZustand';

type FileInfo = {
  name: string;
  loaded: number;
  total: number;
  progress: number;
  mimetype: string;
};

interface Store {
  uploading: boolean;
  fileInfos: FileInfo[];
}

const defaultStore: Store = {
  uploading: false,
  fileInfos: [],
};

export const useUploadingOverlayStore = createZustandStore(
  defaultStore,
  (set) => {
    return {
      actions: {
        begin: (files: File[]) => {
          set({
            uploading: true,
            fileInfos: files.map((file) => ({
              name: file.name,
              loaded: 0,
              total: file.size,
              progress: 0,
              mimetype: file.type,
            })),
          });
        },
        end: () => {
          set({ uploading: false, fileInfos: [] });
        },
        updateInfo: (index: number, fileInfo: FileInfo) => {
          set((d) => {
            d.fileInfos[index] = fileInfo;
          });
        },
      },
    };
  }
);
