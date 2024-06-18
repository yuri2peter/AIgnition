import { Box, Group } from '@mantine/core';
import React from 'react';
import styles from './style.module.css';

const MainLayout: React.FC<{
  header?: React.ReactNode;
  middle?: React.ReactNode;
  rightside?: React.ReactNode;
  leftside?: React.ReactNode;
}> = ({ middle, leftside, rightside }) => {
  return (
    <Box className={styles.container}>
      <Box className={styles.main}>
        <Group className={styles.body} align="stretch" gap={'0'} wrap="nowrap">
          <Box className={styles.leftside}>{leftside}</Box>
          <Box className={styles.middle}>{middle}</Box>
          <Box className={styles.rightside}>{rightside}</Box>
        </Group>
      </Box>
    </Box>
  );
};

export default MainLayout;
