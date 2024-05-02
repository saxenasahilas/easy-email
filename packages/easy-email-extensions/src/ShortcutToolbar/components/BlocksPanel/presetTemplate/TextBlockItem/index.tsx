import React from 'react';
import { Stack } from 'easy-email-editor';
import { AdvancedType } from 'easy-email-core';

import { BlockMaskWrapper } from '@extensions/ShortcutToolbar/components/BlockMaskWrapper';

const fontList = [48, 32, 27, 24, 18, 16, 14];

export function TextBlockItem() {
  return (
    // @ts-ignore
    <Stack.Item fill>
      {/* @ts-ignore */}
      <Stack vertical>
        {fontList.map((item, index) => {
          return (
            // @ts-ignore
            <Stack.Item fill key={index}>
              <BlockMaskWrapper
                type={AdvancedType.TEXT}
                payload={{
                  attributes: {
                    'font-size': item + 'px',
                    padding: '0px 0px 0px 0px'
                  },
                  data: {
                    value: {
                      content: item + 'px',
                    },
                  },
                }}
              >
                <div style={{ fontSize: item, width: '100%', paddingLeft: 20 }}>
                  {item}px
                </div>
              </BlockMaskWrapper>
              {/* @ts-ignore */}
            </Stack.Item>
          );
        })}
        {/* @ts-ignore */}
      </Stack>
      {/* @ts-ignore */}
    </Stack.Item>
  );
}
