import { Box, Group } from '@mantine/core';
import React from 'react';
import clsx from 'clsx';
import styles from './style.module.css';
import ErrorBoundary from 'src/renderer/components/miscs/ErrorBoundary';
import { useMainLayoutStore } from 'src/renderer/store/useMainLayoutStore';

const MainLayout: React.FC<{
  c1?: React.ReactNode;
  c2?: React.ReactNode;
  c3?: React.ReactNode;
  c4?: React.ReactNode;
  background?: React.ReactNode;
}> = ({ c1, c2, c3, c4, background }) => {
  const {
    showLeft,
    actions: { setShowLeft },
  } = useMainLayoutStore();
  return (
    <Box className={styles.container}>
      <ErrorBoundary>
        <Box className={styles.main}>
          <Group
            className={styles.body}
            align="stretch"
            gap={'0'}
            wrap="nowrap"
          >
            {c1 && (
              <Box className={styles.c1}>
                <ErrorBoundary>{c1}</ErrorBoundary>
              </Box>
            )}
            {c2 && (
              <>
                <Box
                  className={clsx(styles.c2, {
                    [styles.open!]: showLeft,
                  })}
                >
                  <ErrorBoundary>{c2}</ErrorBoundary>
                </Box>
                <Box
                  onClick={() => setShowLeft(false)}
                  className={clsx(styles.c2shadown, {
                    [styles.open!]: showLeft,
                  })}
                ></Box>
              </>
            )}
            {c3 && (
              <Box className={styles.c3}>
                <ErrorBoundary>{c3}</ErrorBoundary>
              </Box>
            )}
            {c4 && (
              <Box className={styles.c4}>
                <ErrorBoundary>{c4}</ErrorBoundary>
              </Box>
            )}
          </Group>
        </Box>
      </ErrorBoundary>
      <ErrorBoundary>
        <Box className={styles.bg}>{background}</Box>
      </ErrorBoundary>
    </Box>
  );
};

export default MainLayout;
