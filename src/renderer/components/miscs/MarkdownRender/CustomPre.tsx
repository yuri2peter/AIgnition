import {
  Box,
  Group,
  Stack,
  CopyButton,
  ActionIcon,
  Tooltip,
  rem,
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
  showMaximize?: boolean;
}> = ({ className, children, showMaximize }) => {
  const refRoot = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState('');
  useEffect(() => {
    const pre = refRoot.current?.querySelector('pre');
    if (pre) {
      setContent(pre.textContent || '');
    }
  }, [children]);
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
  return (
    <p>
      <Stack className={styles.root} gap={'md'} ref={refRoot}>
        <Group gap={8}>
          <Circle color="rgb(255,95,86)" />
          <Circle color="rgb(255,189,46)" />
          <Circle color="rgb(39,201,64)" />
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
        </Group>
        <pre className={className}>{children}</pre>
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
