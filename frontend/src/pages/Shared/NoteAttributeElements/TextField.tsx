import { TextInput, Title } from '@mantine/core';
import { useState } from 'react';

interface Props {
  title: string;
  value: string;
  onChange: (e: string) => void;
  editable: boolean;
}

function TextField(props: Props) {
  const [text, setText] = useState(props.value);

  return (
    <>
      <Title m={10} order={3}>
        {props.title}
      </Title>
      <TextInput
        placeholder={props.title}
        value={text}
        onChange={(e) => {
          setText(e.currentTarget.value);
          props.onChange(e.currentTarget.value);
        }}
        disabled={!props.editable}
        m={10}
      />
    </>
  );
}

export default TextField;
