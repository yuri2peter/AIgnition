import React from 'react';
import { Stack } from '@mantine/core';
import Logo from './Logo';
import Sections from './Sections';

const Leftside: React.FC<{}> = () => {
  return (
    <Stack h={'100%'} gap={0} style={{ overflow: 'auto' }}>
      <Logo />
      <Sections />
    </Stack>
  );
};

export default Leftside;
