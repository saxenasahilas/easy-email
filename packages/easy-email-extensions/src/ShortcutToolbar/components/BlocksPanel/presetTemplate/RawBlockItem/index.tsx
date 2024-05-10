import React from 'react';
import { Stack } from 'easy-email-editor';
import { BasicType } from 'easy-email-core';

import { BlockMaskWrapper } from '@extensions/ShortcutToolbar/components/BlockMaskWrapper';

const list = [
  {
    payload: {
      type: BasicType.RAW,
      data: {
        value: {
          content: '<% if (user) { %>'
        },
      },
    },
  },
  {
    payload: {
      type: BasicType.RAW,
      data: {
        value: {
          content: '<% } %>'
        },
      },
    },
  },
];

export function RawBlockItem() {
  return (
    // @ts-ignore
    <Stack.Item fill>
      {/* @ts-ignore */}
      <Stack vertical>
        {list.map((item, index) => {
          return (
            <BlockMaskWrapper
              key={index}
              type={BasicType.RAW}
              payload={item.payload}
            >

              <div style={{ width: '100%', paddingLeft: 20 }}>
                {item.payload.data.value.content}
              </div>

            </BlockMaskWrapper>
          );
        })}
        {/* @ts-ignore */}
      </Stack>
      {/* @ts-ignore */}
    </Stack.Item>
  );
}
