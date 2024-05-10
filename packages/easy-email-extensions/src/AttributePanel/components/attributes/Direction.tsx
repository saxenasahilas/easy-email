import React, { useMemo } from 'react';
import { useFocusIdx, Stack } from 'easy-email-editor';
import { RadioGroupField } from '../../../components/Form';

const options = [
  {
    value: 'ltr',
    get label() {
      return String('ltr');
    },
  },
  {
    value: 'rtl',
    get label() {
      return String('rtl');
    },
  },
];

export function Direction() {
  const { focusIdx } = useFocusIdx();

  return useMemo(() => {
    return (
      // @ts-ignore
      <Stack>
        <RadioGroupField
          label={String('Direction')}
          name={`${focusIdx}.attributes.direction`}
          options={options}
          inline
        />
      </Stack>
    );
  }, [focusIdx]);
}
