import { Box, Stack, Text } from '@mantine/core';
import React from 'react';
import {
  usePageStore,
  selectRecentlyOpenedPages,
} from 'src/renderer/store/usePageStore';
import NavItemListLite from '../../../miscs/NavItemListLite';

const Recently: React.FC<{}> = () => {
  const { lastDay, lastThreeDays } = usePageStore(selectRecentlyOpenedPages);
  return (
    <Stack p={16} gap={24} h={'100%'}>
      {lastDay.length === 0 && lastThreeDays.length === 0 ? (
        <>
          <Text fw={'bold'}>Recently Opened</Text>
          <Text size={'sm'}>No recent history.</Text>
        </>
      ) : (
        <Box style={{ overflow: 'auto' }}>
          {lastDay.length > 0 && (
            <>
              <Text fw={'bold'} mb={8}>
                Today
              </Text>
              <NavItemListLite items={lastDay} />
            </>
          )}
          {lastThreeDays.length > 0 && (
            <>
              <Text fw={'bold'} mt={16} mb={8}>
                Last 3 days
              </Text>
              <NavItemListLite items={lastThreeDays} />
            </>
          )}
        </Box>
      )}
    </Stack>
  );
};

export default Recently;
