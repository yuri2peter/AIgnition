import { Box } from '@mantine/core';
import React from 'react';
import styles from './style.module.css';

export const BackgoundParticles: React.FC<{}> = () => {
  return (
    <>
      <Box className={styles.cover}></Box>
    </>
  );
};

export const Backgound: React.FC<{}> = () => {
  return null;
};

export default BackgoundParticles;
