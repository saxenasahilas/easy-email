import React from 'react';
import { Stack, TextStyle } from 'easy-email-editor';
import { AdvancedType, IDivider, RecursivePartial } from 'easy-email-core';
import { BlockMaskWrapper } from '@extensions/ShortcutToolbar/components/BlockMaskWrapper';

const dividerList = [
  {
    'border-width': '2px',
    'border-style': 'solid',
    'border-color': 'lightgrey',
  },
  {
    'border-width': '2px',
    'border-style': 'dashed',
    'border-color': 'lightgrey',
  },
  {
    'border-width': '2px',
    'border-style': 'dotted',
    'border-color': 'lightgrey',
  },
];

export function DividerBlockItem() {
  return (
    // @ts-ignore
    <Stack.Item fill>
      {/* @ts-ignore */}
      <Stack vertical>
        {/* @ts-ignore */}
        <Stack.Item />
        {/* @ts-ignore */}
        <Stack.Item />
        {dividerList.map((item, index) => {
          return (
            <BlockMaskWrapper
              key={index}
              type={AdvancedType.DIVIDER}
              payload={
                {
                  attributes: { ...item, padding: '10px 0px' },
                } as RecursivePartial<IDivider>
              }
            >
              {/* @ts-ignore */}
              <Stack alignment='center'>
                {/* @ts-ignore */}
                <Stack.Item fill>

                  <div
                    style={{
                      backgroundColor: '#fff',
                      padding: '10px 0px 10px 0px',
                    }}
                  >
                    <div
                      style={{
                        borderTopWidth: item['border-width'],
                        borderTopStyle: item['border-style'] as any,
                        borderTopColor: item['border-color'],

                        boxSizing: 'content-box',
                      }}
                    />
                  </div>
                  {/* @ts-ignore */}
                </Stack.Item>
                <TextStyle>{item['border-style']}</TextStyle>
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
