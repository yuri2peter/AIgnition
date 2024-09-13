import { Box, Stack, Text } from '@mantine/core';
import React from 'react';
import MarkdownToc from 'src/renderer/components/MarkdownToc';
import {
  selectCurrentPage,
  usePageStore,
} from 'src/renderer/store/usePageStore';

const Toc: React.FC<{ tiny?: boolean }> = ({ tiny }) => {
  const currentPage = usePageStore(selectCurrentPage);
  if (!currentPage) return null;
  return (
    <Stack>
      {!tiny && (
        <Text size="sm" fw="bold" c="gray.6">
          Table of Contents
        </Text>
      )}
      <Box pl={0}>
        <MarkdownToc
          markdown={currentPage.content}
          getTocSourceDom={getTocSourceDom}
        />
      </Box>
    </Stack>
  );
};

function getTocSourceDom() {
  return (
    document.querySelector('.w-md-editor-preview') ||
    document.querySelector('.md-content-render-container')
  );
}

export default Toc;
