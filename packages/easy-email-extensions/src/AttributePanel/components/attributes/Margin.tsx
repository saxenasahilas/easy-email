import React, { useMemo } from 'react';
import { TextField } from '../../../components/Form';
import { useFocusIdx, Stack, TextStyle } from 'easy-email-editor';

export function Margin() {
  const { focusIdx } = useFocusIdx();

  return useMemo(() => {
    return (
      // @ts-ignore
      <Stack vertical spacing='extraTight'>
        <TextStyle size='large'>{String('Margin')}</TextStyle>
        {/* @ts-ignore */}
        <Stack wrap={false}>
          {/* @ts-ignore */}
          <Stack.Item fill>
            <TextField
              label={String('Top')}
              quickchange
              name={`${focusIdx}.attributes.marginTop`}
              inline
            />
            {/* @ts-ignore */}
          </Stack.Item>
          {/* @ts-ignore */}
          <Stack.Item fill>
            <TextField
              label={String('Bottom')}
              quickchange
              name={`${focusIdx}.attributes.marginBottom`}
              inline
            />
            {/* @ts-ignore */}
          </Stack.Item>
        </Stack>

        {/* @ts-ignore */}
        <Stack wrap={false}>
          {/* @ts-ignore */}
          <Stack.Item fill>
            <TextField
              label={String('Left')}
              quickchange
              name={`${focusIdx}.attributes.marginLeft`}
              inline
            />
            {/* @ts-ignore */}
          </Stack.Item>
          {/* @ts-ignore */}
          <Stack.Item fill>
            <TextField
              label={String('Right')}
              quickchange
              name={`${focusIdx}.attributes.marginRight`}
              inline
            />
            {/* @ts-ignore */}
          </Stack.Item>
          {/* @ts-ignore */}
        </Stack>
        {/* @ts-ignore */}
      </Stack>
    );
  }, [focusIdx]);
}
