import React, { useMemo } from 'react';
import { TextField } from '../../../components/Form';
import { useFocusIdx, Stack } from 'easy-email-editor';
import { UseFieldConfig } from 'react-final-form';

export function Height({
  inline,
  config,
}: {
  inline?: boolean;
  config?: UseFieldConfig<any>;
}) {
  const { focusIdx } = useFocusIdx();

  return useMemo(() => {
    return (
      // @ts-ignore
      <Stack wrap={false}>
        {/* @ts-ignore */}
        <Stack.Item fill>
          <TextField
            label={String('Height')}
            name={`${focusIdx}.attributes.height`}
            quickchange
            inline={inline}
            config={config}
          />
          {/* @ts-ignore */}
        </Stack.Item>
        {/* @ts-ignore */}
      </Stack>
    );
  }, [focusIdx, inline]);
}
