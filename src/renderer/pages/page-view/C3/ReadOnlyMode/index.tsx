import React, { useEffect, useState } from 'react';
import {
  selectCurrentPage,
  usePageStore,
} from 'src/renderer/store/usePageStore';
import { Box, LoadingOverlay, Stack } from '@mantine/core';
import MarkdownRender from 'src/renderer/components/miscs/MarkdownRender';
import styles from './style.module.css';
import Comment from '../../miscs/Comment';
import { ContiguousPage } from '../../miscs/ContiguousPage';
import clsx from 'clsx';
import Toc from '../../miscs/Toc';
import useIsLargeScreen from 'src/renderer/hooks/screenSize/useIsLargeScreen';
import PageBreadcrumbs from '../../miscs/PageBreadcrumbs';
import SubpageLinks from '../../miscs/SubpageLinks';
import { MetaLite } from '../../miscs/Meta';

const ReadonlyMode: React.FC<{}> = () => {
  const currentPageId = usePageStore((s) => s.currentPageId);
  const currentPage = usePageStore(selectCurrentPage);
  const isLargeScreen = useIsLargeScreen();
  const [page, setPage] = useState(currentPage);
  const id = page?.id;
  const loading = currentPageId !== id;
  useEffect(() => {
    if (currentPage) {
      setPage(currentPage);
    }
  }, [currentPage]);
  useEffect(() => {
    if (!loading) {
      document
        .querySelector('.md-content-render-container>*')
        ?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  }, [loading]);
  return (
    <>
      <LoadingOverlay visible={loading} opacity={0.9} zIndex={50} />
      <Box className={clsx(styles.root, 'md-content-render-container')}>
        <Stack className={styles.stack} gap={0}>
          <Box className={styles.stackTop}></Box>
          <Stack gap={48}>
            <Stack gap={'md'}>
              <PageBreadcrumbs />
              <MetaLite />
            </Stack>
            <MarkdownRender
              text={page?.content || 'No content.'}
              className="md-content-render"
              defaultShowPreviewInHtmlCodeBlock
            />
            <SubpageLinks />
            <Box></Box>
            <ContiguousPage />
            <Comment defaultShow />
          </Stack>
          <Box className={styles.stackBottom}></Box>
        </Stack>
        {isLargeScreen && (
          <Box className={styles.rightside}>
            <Toc tiny />
          </Box>
        )}
      </Box>
    </>
  );
};

export default ReadonlyMode;
