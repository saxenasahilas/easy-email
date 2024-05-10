import React, { useMemo } from 'react';
import { useFocusIdx, Stack } from 'easy-email-editor';
import { RadioGroupField } from '../../../components/Form';

const options = [
  {
    value: 'left',
    get label() {
      return String('Left');
    },
  },
  {
    value: 'center',
    get label() {
      return String('Center');
    },
  },
  {
    value: 'right',
    get label() {
      return String('Right');
    },
  },
];

export function TextAlign({ name }: { name?: string; }) {
  const { focusIdx } = useFocusIdx();

  return useMemo(() => {
    return (
      // @ts-ignore
      <Stack>
        <RadioGroupField
          label={String('Text align')}
          name={name || `${focusIdx}.attributes.text-align`}
          options={options}
        />
      </Stack>
    );
  }, [focusIdx, name]);
}
