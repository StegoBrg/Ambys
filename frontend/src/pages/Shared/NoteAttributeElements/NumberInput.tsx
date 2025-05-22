import { NumberInput, Title } from '@mantine/core';
import { useState } from 'react';

interface Props {
  title: string;
  value: number;
  onChange: (e: number) => void;
  editable: boolean;
}

function NumberInputEl(props: Props) {
  const [number, setNumber] = useState(props.value);

  return (
    <>
      <Title m={10} order={3}>
        {props.title}
      </Title>
      <NumberInput
        placeholder={props.title}
        value={number}
        onChange={(e) => {
          setNumber(+e);
          props.onChange(+e);
        }}
        disabled={!props.editable}
        m={10}
      />
    </>
  );
}

export default NumberInputEl;
