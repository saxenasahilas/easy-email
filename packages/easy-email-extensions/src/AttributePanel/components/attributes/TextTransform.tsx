import React, { useMemo } from 'react';
import { useFocusIdx } from 'easy-email-editor';
import { SelectField } from '../../../components/Form';

const options = [
  {
    value: 'initial',
    get label() {
      return String('None');
    },
  },
  {
    value: 'uppercase',
    get label() {
      return String('uppercase');
    },
  },
  {
    value: 'lowercase',
    get label() {
      return String('lowercase');
    },
  },
  {
    value: 'capitalize',
    get label() {
      return String('capitalize');
    },
  },
];

export function TextTransform({ name }: { name?: string; }) {
  const { focusIdx } = useFocusIdx();

  return useMemo(() => {
    return (
      <SelectField
        label={String('Text transform')}
        name={name || `${focusIdx}.attributes.text-transform`}
        options={options}
      />
    );
  }, [focusIdx, name]);
}
