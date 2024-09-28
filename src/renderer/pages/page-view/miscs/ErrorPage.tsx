import { Box } from '@mantine/core';
import { useEffect } from 'react';
import MarkdownRender from 'src/renderer/components/miscs/MarkdownRender';
import { useLeftsideStore } from 'src/renderer/store/useLeftsideStore';
import { useMainLayoutStore } from 'src/renderer/store/useMainLayoutStore';
import { useUserStore } from 'src/renderer/store/useUserStore';

const errorMesg = `
## Page is unavailable

This could be due to a few reasons:

- Network connectivity problems.
- Permission denied.
- Unexpected server error.

> If it continues, please contact the administrator for help.
`;
const ErrorPage: React.FC<{}> = () => {
  const { setActivedSectionId } = useLeftsideStore((s) => s.actions);
  const loggedIn = useUserStore((s) => s.loggedIn);
  const { setShowLeft } = useMainLayoutStore((s) => s.actions);
  useEffect(() => {
    if (!loggedIn) {
      setActivedSectionId('user');
      setShowLeft(true);
    }
  }, [setShowLeft, loggedIn, setActivedSectionId]);
  return (
    <Box className="mx-auto p-4 pt-12" style={{ maxWidth: '650px' }}>
      <MarkdownRender text={errorMesg} defaultShowPreviewInHtmlCodeBlock />
    </Box>
  );
};

export default ErrorPage;
