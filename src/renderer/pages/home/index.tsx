import { Button, List, Stack, Text } from '@mantine/core';
import React from 'react';
import { APP_NAME } from 'src/common/config';

const Content = () => {
  return (
    <Stack gap="lg">
      <Text size="32px">{APP_NAME}</Text>
      <Text c="gray">🔥Ignite Your Ideas with Artificial Intelligence!</Text>
      <List type="ordered">
        <List.Item>Feature1</List.Item>
        <List.Item>Feature2</List.Item>
        <List.Item>Feature3</List.Item>
        <List.Item>Feature4</List.Item>
      </List>
      <Button
        w="150px"
        mt={'md'}
        component="a"
        href="https://github.com/yuri2peter/AIgnition"
        target="_blank"
      >
        Learn more
      </Button>
    </Stack>
  );
};

const PageHome: React.FC<{}> = () => {
  return (
    <>
      <Content />
    </>
  );
};

export default PageHome;
