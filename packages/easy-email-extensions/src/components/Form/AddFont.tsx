import { FieldArray } from 'react-final-form-arrays';
import React from 'react';
import { IconDelete, IconPlus } from '@arco-design/web-react/icon';
import { TextField } from '.';
import { Button } from '@arco-design/web-react';
import { Stack, TextStyle, useBlock, useFocusIdx } from 'easy-email-editor';
import { Help } from '@extensions/AttributePanel/components/UI/Help';
import { IPage } from 'easy-email-core';

export function AddFont() {
  const { focusBlock } = useBlock();
  const { focusIdx } = useFocusIdx();
  const value: IPage['data']['value'] = focusBlock?.data.value;
  return (
    <FieldArray
      name={`${focusIdx}.data.value.fonts`}
      render={arrayHelpers => {
        return (
          <div>
            {/* @ts-ignore */}
            <Stack
              vertical
              spacing='tight'
            >
              {/* @ts-ignore */}
              <Stack distribution='equalSpacing'>
                <TextStyle variation='strong'>
                  {String('Import font')} <Help title={String('Points to a hosted css file')} />
                </TextStyle>
                {/* @ts-ignore */}
                <Stack>
                  <Button
                    size='small'
                    icon={<IconPlus />}
                    onClick={() => arrayHelpers.fields.push({ name: '', href: '' })}
                  />
                </Stack>
              </Stack>

              {/* @ts-ignore */}
              <Stack
                vertical
                spacing='extraTight'
              >
                {value.fonts?.map((item, index) => {
                  return (
                    <div key={index}>
                      {/* @ts-ignore */}
                      <Stack
                        alignment='center'
                        wrap={false}
                      >
                        {/* @ts-ignore */}
                        <Stack.Item fill>
                          <TextField
                            name={`${focusIdx}.data.value.fonts.${index}.name`}
                            label={String('Name')}
                          />
                          {/* @ts-ignore */}
                        </Stack.Item>
                        {/* @ts-ignore */}
                        <Stack.Item fill>
                          <TextField
                            name={`${focusIdx}.data.value.fonts.${index}.href`}
                            label={String('Href')}
                          />
                          {/* @ts-ignore */}
                        </Stack.Item>
                        {/* @ts-ignore */}
                        <Stack
                          vertical
                          spacing='loose'
                        >
                          {/* @ts-ignore */}
                          <Stack.Item />
                          <Button
                            icon={<IconDelete />}
                            onClick={() => arrayHelpers.fields.remove(index)}
                          />
                          {/* @ts-ignore */}
                        </Stack>
                        {/* @ts-ignore */}
                      </Stack>
                    </div>
                  );
                })}
                {/* @ts-ignore */}
              </Stack>
              {/* @ts-ignore */}
            </Stack>
          </div>
        );
      }}
    />
  );
}
