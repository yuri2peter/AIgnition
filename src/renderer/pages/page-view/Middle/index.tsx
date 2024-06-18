import React, { useEffect, useState } from 'react';
import Markzen from 'src/renderer/components/Markzen';
import { usePageStore } from 'src/renderer/store/usePageStore';
import { TocItem } from '../Rightside/Toc';
import { apiErrorHandler } from 'src/renderer/helpers/api';
import { parseTitleFromMarkdown } from 'src/renderer/components/Markzen/utils';

const Middle: React.FC<{
  onTocChange?: (tocData: TocItem[]) => void;
}> = () => {
  const currentPage = usePageStore((s) => s.currentPage);
  const id = usePageStore((s) => s.currentPageId);
  const { patchPage } = usePageStore((s) => s.actions);
  const [content, setContent] = useState('');
  const isIdMatch = currentPage?.id === id;
  useEffect(() => {
    if (isIdMatch) {
      setContent(currentPage?.content ?? '');
    }
  }, [currentPage?.content, isIdMatch]);
  if (!isIdMatch) return null;
  return (
    <>
      <Markzen
        height="100%"
        value={content}
        onChange={(v) => {
          setContent(v ?? '');
        }}
        onDebouncedChange={(v) => {
          const content = v ?? '';
          const title = parseTitleFromMarkdown(content);
          patchPage({ id, content, title }).catch(apiErrorHandler);
        }}
      />
    </>
  );
};

export default Middle;
