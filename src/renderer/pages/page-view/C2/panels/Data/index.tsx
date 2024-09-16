import { Button, Stack, Text } from '@mantine/core';
import React from 'react';
import { openImportFromJotwayModal } from './ImportFromJotway';
import { modals } from '@mantine/modals';
import { api, apiErrorHandler } from 'src/renderer/helpers/api';
import { notifications } from '@mantine/notifications';
import { navigate } from 'src/renderer/hacks/navigate';
import { clearLinkIconCache } from 'src/renderer/components/miscs/LinkIconPreview';
import { openImportFromBrowserFavoritesModalModal } from './ImportFromBrowserFavorites';
import { z } from 'zod';
import { openImportFromArchiveModal } from './ImportFromArchive';
import { usePageStore } from 'src/renderer/store/usePageStore';

const buttonProps = {
  variant: 'light',
};

const SectionData: React.FC<{}> = () => {
  return (
    <Stack p={16} gap={32}>
      <Stack>
        <Text fw={'bold'}>Export data</Text>
        <Button {...buttonProps} onClick={handleSaveArchive}>
          Save archive
        </Button>
      </Stack>
      <Stack>
        <Text fw={'bold'}>Import data</Text>
        <Button {...buttonProps} onClick={openImportFromArchiveModal}>
          From archive
        </Button>
        <Button
          {...buttonProps}
          onClick={openImportFromBrowserFavoritesModalModal}
        >
          From browser favorites
        </Button>
        <Button {...buttonProps} onClick={openImportFromJotwayModal}>
          From jotway v1.3
        </Button>
      </Stack>
      <Stack>
        <Text fw={'bold'}>User guide</Text>
        <Button
          {...buttonProps}
          onClick={async () => {
            try {
              await api().post('/api/miscs/recreate-user-guide');
              await usePageStore.getState().actions.pullPages();
              navigate('/aignition-user-guide');
              notifications.show({
                title: 'Action performed',
                message: 'User guide recreated successfully',
                color: 'green',
              });
            } catch (error) {
              apiErrorHandler(error);
            }
          }}
        >
          Recreate user guide
        </Button>
      </Stack>
      <Stack>
        <Text fw={'bold'}>Uploads</Text>
        <Button {...buttonProps} onClick={handleDeleteUnusedUploads}>
          Delete unused uploads
        </Button>
      </Stack>
      <Stack>
        <Text fw={'bold'}>Cache</Text>
        <Button
          {...buttonProps}
          onClick={() => {
            api()
              .post('/api/page/remove-guest-pages-cache')
              .then(() => {
                notifications.show({
                  title: 'Action performed',
                  message: 'Guest pages cache cleared successfully',
                  color: 'green',
                });
              })
              .catch(apiErrorHandler);
          }}
        >
          Clear guest pages cache
        </Button>
        <Button
          {...buttonProps}
          onClick={() => {
            clearLinkIconCache();
            api()
              .post('/api/miscs/remove-parse-link-icon')
              .then(() => {
                notifications.show({
                  title: 'Action performed',
                  message: 'Server link icon cache cleared successfully',
                  color: 'green',
                });
              })
              .catch(apiErrorHandler);
          }}
        >
          Clear link icon cache
        </Button>
      </Stack>
      <Stack>
        <Text fw={'bold'}>Danger zone</Text>
        <Button {...buttonProps} onClick={handleResetData}>
          Reset data
        </Button>
      </Stack>
    </Stack>
  );
};

export default SectionData;

function handleResetData() {
  modals.openConfirmModal({
    title: 'Please confirm your action',
    children: (
      <Text size="sm">
        This action will clear all data and reset the settings to their
        defaults. Please click one of the following buttons to continue.
      </Text>
    ),
    labels: { confirm: 'Confirm', cancel: 'Cancel' },
    onConfirm: () => {
      api()
        .post('/api/page/reset-data')
        .then(() => {
          modals.closeAll();
          notifications.show({
            title: 'Action performed',
            message: 'Data reset successfully',
            color: 'green',
          });
          navigate('/');
        })
        .catch(apiErrorHandler);
    },
  });
}

function handleDeleteUnusedUploads() {
  modals.openConfirmModal({
    title: 'Please confirm your action',
    children: (
      <Text size="sm">
        This action will delete all unused uploads. Please click one of the
        following buttons to continue.
      </Text>
    ),
    labels: { confirm: 'Confirm', cancel: 'Cancel' },
    onConfirm: () => {
      api()
        .post('/api/miscs/delete-unused-uploads')
        .then(({ data }) => {
          const { sum, deletedCount } = z
            .object({
              sum: z.number(),
              deletedCount: z.number(),
            })
            .parse(data);
          notifications.show({
            title: 'Action performed',
            message: 'Deleted ' + deletedCount + ' / ' + sum + ' files',
            color: 'green',
          });
        })
        .catch(apiErrorHandler);
    },
  });
}

async function handleSaveArchive() {
  try {
    await api().post('/api/miscs/export-archive');
    const downloadLink = document.createElement('a');
    downloadLink.href = '/api/miscs/download-archive';
    downloadLink.click();
    notifications.show({
      title: 'Action performed',
      message: 'Archive download successfully',
      color: 'green',
    });
  } catch (error) {
    apiErrorHandler(error);
  }
}
