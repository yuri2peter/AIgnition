import React, { useState } from 'react';
import { ContextModalProps, openContextModal } from '@mantine/modals';
import { Button, Group, Stack, Text } from '@mantine/core';
import { dataInsert } from './dataInsert';
import { api, apiErrorHandler } from 'src/renderer/helpers/api';
import { notifications } from '@mantine/notifications';
import { usePageStore } from 'src/renderer/store/usePageStore';
import FileDropzone from 'src/renderer/components/miscs/FileDropzone';
import { IBaseMark } from 'bookmark-file-parser';
import { formatTime } from 'src/common/utils/time';

export const ImportFromBrowserFavoritesModal = ({
  context,
  id,
}: ContextModalProps<{}>) => {
  const [folders, setFolders] = useState<
    {
      title: string;
      level: number;
      childrenCount: number;
    }[]
  >([]);
  const [dataParsed, setDataParsed] = useState<IBaseMark | null>(null);
  const [processing, setProcessing] = useState(false);
  const { pullPages } = usePageStore((s) => s.actions);
  const dataReady = !!dataParsed;
  return (
    <Stack>
      {dataReady ? (
        processing ? (
          <Text>Processing...</Text>
        ) : (
          <Stack gap={0}>
            <Text>Data loaded:</Text>
            {folders.map((t) => (
              <Text ml={(t.level + 1) * 16}>
                {t.title} ({t.childrenCount})
              </Text>
            ))}
          </Stack>
        )
      ) : (
        <FileDropzone
          maxFiles={1}
          onDrop={async (files) => {
            const firstFile = files[0];
            if (firstFile) {
              const text = await firstFile.text();
              try {
                const { data } = await api().post(
                  '/api/miscs/parse-bookmarks',
                  {
                    text,
                  }
                );
                const bookmarks: IBaseMark = {
                  name: `Favorites (${formatTime()})`,
                  type: 'folder',
                  href: '',
                  icon: '',
                  children: data,
                };
                setDataParsed(bookmarks);
                const folders: {
                  title: string;
                  level: number;
                  childrenCount: number;
                }[] = [];
                const traversal = (mark: IBaseMark, level = 0) => {
                  if (mark.type === 'folder') {
                    let count = 0;
                    mark.children.forEach((child) => {
                      count++;
                      traversal(child, level + 1);
                    });
                    folders.push({
                      title: mark.name,
                      level,
                      childrenCount: count,
                    });
                  }
                };
                traversal(bookmarks);
                setFolders(folders.reverse());
              } catch (error) {
                apiErrorHandler(error);
              }
            }
          }}
          accept={['text/html']}
          title1="Drag file here or click to select file"
          title2="The file should be in html format. Example: favorites.html"
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
            await dataInsert(dataParsed!)
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

export const openImportFromBrowserFavoritesModalModal = () => {
  openContextModal({
    modal: 'ImportFromBrowserFavoritesModal',
    title: 'Import data from browser favorites',
    size: 'lg',
    innerProps: {},
  });
};
