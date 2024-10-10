import React, { useEffect, useState } from 'react';
import EditorWrap from 'src/renderer/components/EditorWrap';
import scrollIntoView from 'smooth-scroll-into-view-if-needed';
import {
  selectCurrentPage,
  usePageStore,
} from 'src/renderer/store/usePageStore';
import { apiErrorHandler } from 'src/renderer/helpers/api';
import { parseTitleFromMarkdown } from 'src/renderer/components/EditorWrap/utils';
import { Box, Stack } from '@mantine/core';
import {
  useNonSensitiveSettingsStore,
  selectAiEnabled,
} from 'src/renderer/store/useNonSensitiveSettingsStore';
import PageBreadcrumbs from '../miscs/PageBreadcrumbs';
import SubpageLinks from '../miscs/SubpageLinks';
import { ContiguousPage } from '../miscs/ContiguousPage';
import Comment from '../miscs/Comment';
import { MetaLite } from '../miscs/Meta';
import UploadingOverlay from 'src/renderer/components/EditorWrap/UploadingOverlay';

const EditorMode: React.FC<{}> = () => {
  const currentPageId = usePageStore((s) => s.currentPageId);
  const currentPage = usePageStore(selectCurrentPage);
  const [page, setPage] = useState(currentPage);
  const { patchPage, updateOpenedAtForCurrentPage } = usePageStore(
    (s) => s.actions
  );
  const aiEnabled = useNonSensitiveSettingsStore(selectAiEnabled);
  const id = page?.id;
  const loading = currentPageId !== id;
  useEffect(() => {
    if (currentPage) {
      setPage(currentPage);
      // If the page is a new page, auto focus and select the title
      (() => {
        if (currentPage.content.match(/^#\s.+Untitled\s+$/)) {
          requestAnimationFrame(() => {
            const el: HTMLTextAreaElement | null = document.querySelector(
              'textarea.w-md-editor-text-input'
            );
            if (el) {
              setTimeout(() => {
                el.focus();
                el.setSelectionRange(5, 13);
              }, 300);
            }
          });
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage?.id]);
  useEffect(() => {
    if (!loading) {
      const anchor = document.querySelector('.w-md-editor-preview>*>*>*');

      if (anchor) {
        scrollIntoView(anchor, { behavior: 'smooth' });
      }
    }
  }, [loading]);
  useEffect(() => {
    const itv = setInterval(() => {
      updateOpenedAtForCurrentPage().catch(() => {});
    }, 1000 * 5);
    return () => clearInterval(itv);
  }, [id, updateOpenedAtForCurrentPage]);
  return (
    <>
      <UploadingOverlay />
      <EditorWrap
        instanceId={id}
        useAi={aiEnabled}
        height="100%"
        initValue={page?.content ?? ''}
        onContentChange={(v) => {
          const content = v ?? '';
          const title = parseTitleFromMarkdown(content);
          patchPage({ id: page!.id, content, title }).catch(apiErrorHandler);
        }}
        previewHeader={
          <>
            <PageBreadcrumbs />
            <MetaLite />
          </>
        }
        previewFooter={
          <Stack gap={48} mt={32} pb={24}>
            <SubpageLinks />
            <Box></Box>
            <ContiguousPage />
            <Comment />
          </Stack>
        }
      />
    </>
  );
};

export default EditorMode;
