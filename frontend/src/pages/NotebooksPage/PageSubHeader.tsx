import { ActionIcon, Center, Grid, Title } from '@mantine/core';
import { TbArrowLeft, TbTrash } from 'react-icons/tb';

interface Props {
  title: string;
  onBackClick: () => void;
  onDeleteClick: () => void;
}

function PageSubHeader(props: Props) {
  return (
    <Grid m={5}>
      <Grid.Col span='content'>
        <ActionIcon
          variant='transparent'
          size='lg'
          ml={5}
          onClick={props.onBackClick}
        >
          <TbArrowLeft size={24} />
        </ActionIcon>
      </Grid.Col>

      <Grid.Col span='auto'>
        <Center>
          <Title order={3}>{props.title}</Title>
        </Center>
      </Grid.Col>

      <Grid.Col span='content'>
        <ActionIcon
          variant='transparent'
          color='red'
          mr={5}
          onClick={props.onDeleteClick}
        >
          <TbTrash size='2rem' />
        </ActionIcon>
      </Grid.Col>
    </Grid>
  );
}

export default PageSubHeader;
