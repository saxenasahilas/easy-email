import React from 'react';
import { useFocusIdx } from 'easy-email-editor';
import { RadioGroupField } from '../../../components/Form';

const options = [
  {
    value: 'left',
    get label() {
      return String('left');
    },
  },
  {
    value: 'center',
    get label() {
      return String('center');
    },
  },
  {
    value: 'right',
    get label() {
      return String('right');
    },
  },
];

export function Align({ inline }: { inline?: boolean; }) {
  const { focusIdx } = useFocusIdx();

  return (
    <RadioGroupField
      label={String('Align')}
      name={`${focusIdx}.attributes.align`}
      options={options}
    />
  );
}
