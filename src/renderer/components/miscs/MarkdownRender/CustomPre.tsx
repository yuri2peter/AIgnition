import {
  Box,
  Group,
  Stack,
  CopyButton,
  ActionIcon,
  Tooltip,
  rem,
  Button,
} from '@mantine/core';
import React, { useEffect, useRef, useState } from 'react';
import styles from './CustomPre.module.css';
import FlexGrow from '../FlexGrow';
import { IconCheck, IconCopy, IconMaximize } from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import clsx from 'clsx';

const CustomPre: React.FC<{
  className?: string;
  children: React.ReactNode;
  isHtml?: boolean;
  defaultShowPreviewInHtmlCodeBlock?: boolean;
  showMaximize?: boolean;
}> = ({
  className,
  children,
  showMaximize,
  defaultShowPreviewInHtmlCodeBlock = false,
  isHtml,
}) => {
  const refRoot = useRef<HTMLDivElement>(null);
  const refIframe = useRef<HTMLIFrameElement>(null);
  const [content, setContent] = useState('');
  const [iframeHeight, setIframeHeight] = useState(120);
  const [previewMode, setPreviewMode] = useState(
    defaultShowPreviewInHtmlCodeBlock
  );
  useEffect(() => {
    const pre = refRoot.current?.querySelector('pre');
    if (pre) {
      console.log(pre);
      setContent(pre.textContent || '');
    }
  }, [children]);
  useEffect(() => {
    const itv = setInterval(() => {
      const body = refIframe.current?.contentDocument?.body;
      if (body && body.scrollHeight) {
        body.style.margin = '0';
        body.style.padding = '8px';
        setIframeHeight(body.scrollHeight + 4);
      }
    }, 1000);
    return () => clearInterval(itv);
  }, []);
  const handleMaximize = () => {
    modals.open({
      withCloseButton: false,
      size: 'xl',
      padding: 0,
      radius: '0.375rem',
      children: (
        <Box
          className={clsx(
            className,
            'prism-highlight prism-highlight-dark',
            'prose',
            'prose-code:text-sm',
            'max-w-none'
          )}
        >
          <CustomPre className={className} children={children} />
        </Box>
      ),
      onClose: () => modals.closeAll(),
    });
  };
  const decos = (
    <>
      <Circle color="rgb(255,95,86)" />
      <Circle color="rgb(255,189,46)" />
      <Circle color="rgb(39,201,64)" />
    </>
  );
  const windowButtons = (
    <>
      <FlexGrow />
      <Group gap={'sm'} className={styles.buttons}>
        <CopyButton value={content}>
          {({ copied, copy }) => (
            <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow>
              <ActionIcon
                size={'xs'}
                color={copied ? 'teal' : 'gray'}
                variant="subtle"
                onClick={copy}
              >
                {copied ? (
                  <IconCheck style={{ width: rem(16) }} />
                ) : (
                  <IconCopy style={{ width: rem(16) }} />
                )}
              </ActionIcon>
            </Tooltip>
          )}
        </CopyButton>
        {showMaximize && (
          <Tooltip label={'Fullscreen'} withArrow>
            <ActionIcon
              size={'xs'}
              color={'gray'}
              variant="subtle"
              onClick={handleMaximize}
            >
              <IconMaximize style={{ width: rem(16) }} />
            </ActionIcon>
          </Tooltip>
        )}
      </Group>
    </>
  );
  const previewButtons = (
    <>
      <Button
        size="xs"
        variant="subtle"
        color={!previewMode ? 'blue' : 'gray'}
        onClick={() => setPreviewMode(false)}
      >
        Code
      </Button>
      <Button
        size="xs"
        variant="subtle"
        color={previewMode ? 'blue' : 'gray'}
        onClick={() => setPreviewMode(true)}
      >
        Preview
      </Button>
    </>
  );
  const code = (
    <pre
      style={{ display: isHtml && previewMode ? 'none' : 'block' }}
      className={className}
    >
      {children}
    </pre>
  );
  const preview = (
    <iframe
      ref={refIframe}
      style={{
        display: isHtml && previewMode ? 'block' : 'none',
        height: iframeHeight,
      }}
      className={styles.iframe}
      srcDoc={content}
    ></iframe>
  );
  return (
    <p>
      <Stack className={styles.root} gap={'md'} ref={refRoot}>
        <Group gap={8}>
          {isHtml ? previewButtons : decos}
          {windowButtons}
        </Group>
        {isHtml && preview}
        {code}
      </Stack>
    </p>
  );
};

const Circle: React.FC<{
  color?: string;
}> = ({ color }) => {
  return (
    <Box className={styles.circle} style={{ backgroundColor: color }}></Box>
  );
};

export default CustomPre;
