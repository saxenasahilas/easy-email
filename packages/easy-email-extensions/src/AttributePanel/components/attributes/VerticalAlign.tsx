import React, { useMemo } from 'react';
import { useFocusIdx, Stack } from 'easy-email-editor';
import { SelectField } from '../../../components/Form';

const options = [
  {
    value: 'top',
    get label() {
      return String('top');
    },
  },
  {
    value: 'middle',
    get label() {
      return String('middle');
    },
  },
  {
    value: 'bottom',
    get label() {
      return String('bottom');
    },
  },
];

export function VerticalAlign({
  attributeName = 'vertical-align',
}: {
  attributeName?: string;
}) {
  const { focusIdx } = useFocusIdx();

  return useMemo(() => {
    return (
      // @ts-ignore
      <Stack>
        <SelectField
          style={{ width: 120 }}
          label={String('Vertical align')}
          name={`${focusIdx}.attributes.${attributeName}`}
          options={options}
        />
      </Stack>
    );
  }, [attributeName, focusIdx]);
}
