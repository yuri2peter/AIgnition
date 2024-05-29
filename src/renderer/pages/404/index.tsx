import React from 'react';
import { Container, Title, Text, Button, Group } from '@mantine/core';
import { Link } from 'react-router-dom';
import Illustration from './Illustration';
import classes from './NothingFoundBackground.module.css';

const Page404: React.FC<{}> = () => {
  return (
    <Container className={classes.root}>
      <div className={classes.inner}>
        <Illustration className={classes.image} />
        <div className={classes.content}>
          <Title className={classes.title}>Nothing to see here</Title>
          <Text
            c="dimmed"
            size="lg"
            ta="center"
            className={classes.description}
          >
            Page you are trying to open does not exist. You may have mistyped
            the address, or the page has been moved to another URL. If you think
            this is an error contact support.
          </Text>
          <Group justify="center">
            <Button size="md" component={Link} to="/a/jottings">
              Take me back to home page
            </Button>
          </Group>
        </div>
      </div>
    </Container>
  );
};

export default Page404;
