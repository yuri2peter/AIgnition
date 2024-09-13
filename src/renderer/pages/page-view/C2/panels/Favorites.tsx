import { Box, Stack, Text } from '@mantine/core';
import React from 'react';
import {
  selectFavoritePages,
  usePageStore,
} from 'src/renderer/store/usePageStore';
import NavItemListLite from '../../miscs/NavItemListLite';

export const Favorites: React.FC<{ show: boolean }> = ({ show }) => {
  const favoritePages = usePageStore(selectFavoritePages);
  return (
    <Stack p={16} gap={24} h={'100%'} display={show ? undefined : 'none'}>
      <Text fw={'bold'}>Favorites</Text>
      {favoritePages.length === 0 ? (
        <>
          <Text size={'sm'}>No favorites yet.</Text>
        </>
      ) : (
        <Box style={{ overflow: 'auto' }}>
          <NavItemListLite items={favoritePages} />
        </Box>
      )}
    </Stack>
  );
};
