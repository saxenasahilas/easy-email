import React, { useMemo } from 'react';
import { NumberField, TextField } from '../../../components/Form';
import { useFocusIdx, Stack, TextStyle } from 'easy-email-editor';

export function Decoration() {
  const { focusIdx } = useFocusIdx();

  return useMemo(() => {
    return (
      //@ts-ignore
      <Stack
        key={focusIdx}
        vertical
        spacing='extraTight'
      >
        <TextStyle
          variation='strong'
          size='large'
        >
          Decoration
        </TextStyle>
        <TextField
          label={String('Border radius')}
          name={`${focusIdx}.attributes.borderRadius`}
          inline
        />
        <TextField
          label={String('Border')}
          name={`${focusIdx}.attributes.border`}
          inline
        />
        <NumberField
          label={String('Opacity')}
          max={1}
          min={0}
          step={0.1}
          name={`${focusIdx}.attributes.opacity`}
          inline
        />
      </Stack>
    );
  }, [focusIdx]);
}
