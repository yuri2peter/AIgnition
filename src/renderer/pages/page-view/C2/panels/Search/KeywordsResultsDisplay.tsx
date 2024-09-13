import { Box, Text } from '@mantine/core';
import React from 'react';
import {
  selectComputedPagesDfs,
  usePageStore,
} from 'src/renderer/store/usePageStore';
import { useSearchStore } from 'src/renderer/store/useSearchStore';
import NavItemListLite from '../../../miscs/NavItemListLite';

const KeywordsResultsDisplay: React.FC<{}> = () => {
  const pages = usePageStore(selectComputedPagesDfs);
  const matchIds = useSearchStore((s) => s.matchIds);
  const inputValue = useSearchStore((s) => s.inputValue);
  const noResults = inputValue.length >= 2 && matchIds.length === 0;
  const matchedPages = matchIds
    .map((t) => pages.find((p) => p.id === t))
    .filter(Boolean);
  return (
    <Box style={{ overflow: 'auto' }}>
      {noResults ? (
        <Text size="xs" c={'gray.6'}>
          No results.
        </Text>
      ) : (
        <NavItemListLite items={matchedPages} />
      )}
    </Box>
  );
};

export default KeywordsResultsDisplay;
