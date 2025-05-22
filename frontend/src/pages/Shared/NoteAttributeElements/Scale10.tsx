import { Title, Grid, Button } from '@mantine/core';
import { useState } from 'react';

interface Props {
  title: string;
  value: number;
  onChange: (e: number) => void;
  editable: boolean;
}

function Scale10(props: Props) {
  const [valueState, setValueState] = useState(props.value);

  return (
    <>
      <Title m={10} order={3}>
        {props.title}
      </Title>
      <Grid justify='center' gutter={5} m={10}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) => (
          <Grid.Col
            key={number}
            span={2.4} // 12 columns is default so 2.4 is 1/5 resulting in 5 Buttons per row.
          >
            <Button
              size='lg'
              fullWidth
              p={0}
              onClick={() => {
                setValueState(number);
                props.onChange(number);
              }}
              disabled={!props.editable && valueState !== number} // Disable all buttons except the selected one to retain color.
              color={valueState === number ? 'blue' : 'gray'}
            >
              {number}
            </Button>
          </Grid.Col>
        ))}
      </Grid>
    </>
  );
}

export default Scale10;
