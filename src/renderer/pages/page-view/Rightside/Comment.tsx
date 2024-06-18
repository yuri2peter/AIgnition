// https://giscus.app/
import React from 'react';
import Giscus from '@giscus/react';
import { usePageStore } from 'src/renderer/store/usePageStore';
import { useNonSensitiveSettingsStore } from 'src/renderer/store/useNonSensitiveSettingsStore';

const Comment: React.FC<{}> = () => {
  const enabledGiscus = useNonSensitiveSettingsStore(
    (s) => s.settings.giscus.enabled
  );
  const currentPage = usePageStore((s) => s.currentPage);
  if (!currentPage || !currentPage.isPublic || !enabledGiscus) return null;
  return (
    <Giscus
      id="comments"
      repo="yuri2peter/giscus_repo"
      repoId="R_kgDOMERyWQ"
      category="Announcements"
      categoryId="DIC_kwDOMERyWc4Cf0db"
      mapping="url"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme="light"
      lang="en"
      loading="lazy"
    />
  );
};

export default Comment;
