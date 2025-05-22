import { Checkbox } from '@mantine/core';
import { useState } from 'react';

interface Props {
  title: string;
  value: boolean;
  onChange: (e: boolean) => void;
  editable: boolean;
}

function CheckBox(props: Props) {
  const [checked, setChecked] = useState(props.value);

  return (
    <>
      <Checkbox
        label={props.title}
        size='md'
        checked={checked}
        onChange={() => {
          setChecked(!checked);
          props.onChange(!checked);
        }}
        disabled={!props.editable}
        m={10}
      />
    </>
  );
}

export default CheckBox;
