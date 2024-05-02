import React from 'react';
import { Stack, TextStyle } from 'easy-email-editor';
import { AdvancedType, ISpacer, RecursivePartial } from 'easy-email-core';

import { BlockMaskWrapper } from '@extensions/ShortcutToolbar/components/BlockMaskWrapper';

const spacerList = [10, 15, 20, 30, 50, 60, 100];

export function SpacerBlockItem() {
  return (
    // @ts-ignore
    <Stack.Item fill>
      {/* @ts-ignore */}
      <Stack vertical>
        {spacerList.map((item, index) => {
          return (
            <BlockMaskWrapper
              key={index}
              type={AdvancedType.SPACER}
              payload={
                {
                  attributes: {
                    height: item + 'px',
                  },
                } as RecursivePartial<ISpacer>
              }
            >
              {/* @ts-ignore */}
              <Stack alignment='center'>
                {/* @ts-ignore */}
                <Stack.Item fill>

                  <div
                    style={{
                      marginBottom: 20,
                      backgroundColor: '#efeeea',
                      position: 'relative',
                      height: item,
                      boxShadow: ' 3px 3px 3px rgb(0 0 0 / 0.2)',
                    }}
                  />
                  {/* @ts-ignore */}
                </Stack.Item>
                <TextStyle>{item} px</TextStyle>
                {/* @ts-ignore */}
              </Stack>
            </BlockMaskWrapper>
          );
        })}
        {/* @ts-ignore */}
      </Stack>
      {/* @ts-ignore */}
    </Stack.Item>
  );
}
