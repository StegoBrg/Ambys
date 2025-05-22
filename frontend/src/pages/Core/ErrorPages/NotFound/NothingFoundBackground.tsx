import { Button, Container, Group, Text, Title } from '@mantine/core';
import { Illustration } from './Illustration';
import classes from './NothingFoundBackground.module.css';

export function NothingFoundBackground() {
  return (
    <Container className={classes.root}>
      <div className={classes.inner}>
        <Illustration className={classes.image} />
        <div className={classes.content}>
          <Title className={classes.title}>Nothing to see here</Title>
          <Text
            c='dimmed'
            size='lg'
            ta='center'
            className={classes.description}
          >
            Page you are trying to open does not exist. You may have mistyped
            the address, or the page has been moved to another URL.
          </Text>
          <Group justify='center'>
            <Button
              size='md'
              onClick={() => {
                window.location.href = '/';
              }}
            >
              Take me back to home page
            </Button>
          </Group>
        </div>
      </div>
    </Container>
  );
}
