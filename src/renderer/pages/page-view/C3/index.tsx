import React from 'react';
import {
  selectCurrentPage,
  usePageStore,
} from 'src/renderer/store/usePageStore';
import { Paper } from '@mantine/core';
import ErrorPage from '../miscs/ErrorPage';
import EditorMode from './EditorMode';
import ReadonlyMode from './ReadOnlyMode';
import { useUserStore } from 'src/renderer/store/useUserStore';

const C3: React.FC<{}> = () => {
  const currentPage = usePageStore(selectCurrentPage);
  const loggedIn = useUserStore((s) => s.loggedIn);
  const pagesLoaded = usePageStore((s) => s.pagesLoaded);
  const content = (() => {
    if (!pagesLoaded) {
      return null;
    }
    if (!currentPage) {
      return <ErrorPage />;
    }
    if (!loggedIn) {
      return <ReadonlyMode />;
    }
    return <EditorMode />;
  })();
  return (
    <Paper h="100%" className="overflow-auto" pos="relative">
      {content}
    </Paper>
  );
};

export default C3;
