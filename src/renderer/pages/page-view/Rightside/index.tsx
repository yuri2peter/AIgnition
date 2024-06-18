import { Stack } from '@mantine/core';
import React from 'react';
import Comment from './Comment';
import Info from './Info';
import Chat from './Chat';
import Title from './Title';

const Rightside: React.FC<{}> = () => {
  return (
    <Stack h={'100%'}>
      <Title />
      <Stack style={{ overflow: 'auto', flexGrow: 1 }} gap={'xl'} p={16}>
        <Info />
        <Chat />
        <Comment />
      </Stack>
    </Stack>
  );
};

export default Rightside;
