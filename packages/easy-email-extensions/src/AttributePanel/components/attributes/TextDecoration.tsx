import React, { useMemo } from 'react';
import { useFocusIdx } from 'easy-email-editor';
import { SelectField } from '../../../components/Form';

const options = [
  {
    value: '',
    get label() {
      return String('None');
    },
  },
  {
    value: 'underline',
    get label() {
      return String('Underline');
    },
  },
  {
    value: 'overline',
    get label() {
      return String('Overline');
    },
  },
  {
    value: 'line-through',
    get label() {
      return String('Line through');
    },
  },
  {
    value: 'blink',
    get label() {
      return String('Blink');
    },
  },
  {
    value: 'inherit',
    get label() {
      return String('Inherit');
    },
  },
];

export function TextDecoration({ name }: { name?: string; }) {
  const { focusIdx } = useFocusIdx();

  return useMemo(() => {
    return (
      <SelectField
        label={String('Text decoration')}
        name={name || `${focusIdx}.attributes.text-decoration`}
        options={options}
      />
    );
  }, [focusIdx, name]);
}
