import React, { useMemo } from 'react';
import { useFocusIdx } from 'easy-email-editor';
import { SelectField } from '../../../components/Form';

export const borderStyleOptions = [
  {
    value: 'dashed',
    get label() {
      return String('Dashed');
    },
  },
  {
    value: 'dotted',
    get label() {
      return String('Dotted');
    },
  },
  {
    value: 'solid',
    get label() {
      return String('Solid');
    },
  },
  {
    value: 'double',
    get label() {
      return String('double');
    },
  },
  {
    value: 'ridge',
    get label() {
      return String('ridge');
    },
  },
  {
    value: 'groove',
    get label() {
      return String('groove');
    },
  },
  {
    value: 'inset',
    get label() {
      return String('inset');
    },
  },
  {
    value: 'outset',
    get label() {
      return String('outset');
    },
  },
];

export function BorderStyle() {
  const { focusIdx } = useFocusIdx();

  return useMemo(() => {
    return (
      <SelectField
        label={String('Style')}
        name={`${focusIdx}.attributes.border-style`}
        options={borderStyleOptions}
      />
    );
  }, [focusIdx]);
}
