// https://giscus.app/
import React, { useEffect, useState } from 'react';
import Giscus from '@giscus/react';
import {
  selectCurrentPage,
  usePageStore,
} from 'src/renderer/store/usePageStore';
import { useNonSensitiveSettingsStore } from 'src/renderer/store/useNonSensitiveSettingsStore';
import { Box, Button } from '@mantine/core';
import { IconMessage } from '@tabler/icons-react';

const Comment: React.FC<{ defaultShow?: boolean }> = ({ defaultShow }) => {
  const [show, setShow] = useState(false);
  const enabledGiscus = useNonSensitiveSettingsStore(
    (s) => s.settings.giscus.enabled
  );
  const currentPage = usePageStore(selectCurrentPage);
  useEffect(() => {
    if (currentPage?.id) {
      setShow(false);
    }
  }, [currentPage?.id]);
  if (!currentPage || !currentPage.computed.isPublic || !enabledGiscus)
    return null;
  if (!show && !defaultShow) {
    return (
      <Button
        variant="subtle"
        size="md"
        onClick={() => setShow(true)}
        leftSection={<IconMessage stroke={1.5} />}
      >
        Show comments
      </Button>
    );
  }
  return (
    <Box w="100%" p={1}>
      <Giscus
        term={currentPage.id}
        id="comments"
        repo="yuri2peter/giscus_repo"
        repoId="R_kgDOMERyWQ"
        category="Announcements"
        categoryId="DIC_kwDOMERyWc4Cf0db"
        mapping="specific"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={'light'}
        lang="en"
        loading="lazy"
      />
    </Box>
  );
};

export default Comment;
