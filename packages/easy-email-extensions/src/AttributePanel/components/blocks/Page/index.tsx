import React from 'react';
import {
  ColorPickerField,
  InputWithUnitField,
  NumberField,
  TextAreaField,
  TextField,
} from '@extensions/components/Form';
import { AddFont } from '@extensions/components/Form/AddFont';
import { Collapse, Grid, Space } from '@arco-design/web-react';
import { Stack, useFocusIdx } from 'easy-email-editor';
import { AttributesPanelWrapper } from '@extensions/AttributePanel/components/attributes/AttributesPanelWrapper';
import { FontFamily } from '../../attributes/FontFamily';
import { pixelAdapter } from '../../adapter';

interface PageProps { hideSubTitle?: boolean; hideSubject?: boolean; }
export function Page({ hideSubTitle, hideSubject }: PageProps) {
  const { focusIdx } = useFocusIdx();

  if (!focusIdx) return null;

  return (
    <AttributesPanelWrapper style={{ padding: 0 }}>
      {/* @ts-ignore */}
      <Stack.Item fill>
        <Collapse defaultActiveKey={['0', '1']}>
          <Collapse.Item
            name='0'
            header={String('Email Setting')}
          >
            <Space direction='vertical'>
              {!hideSubject && (
                <TextField
                  label={String('Subject')}
                  name={'subject'}
                  inline
                />
              )}
              {!hideSubTitle && (
                <TextField
                  label={String('SubTitle')}
                  name={'subTitle'}
                  inline
                />
              )}
              <InputWithUnitField
                label={String('Width')}
                name={`${focusIdx}.attributes.width`}
                inline
              />
              <InputWithUnitField
                label={String('Breakpoint')}
                helpText={String(
                  'Allows you to control on which breakpoint the layout should go desktop/mobile.',
                )}
                name={`${focusIdx}.data.value.breakpoint`}
                inline
              />
            </Space>
          </Collapse.Item>
          <Collapse.Item
            name='1'
            header={String('Theme Setting')}
          >
            {/* @ts-ignore */}
            <Stack
              vertical
              spacing='tight'
            >
              <Grid.Row>
                <Grid.Col span={11}>
                  <FontFamily name={`${focusIdx}.data.value.font-family`} />
                </Grid.Col>
                <Grid.Col
                  offset={1}
                  span={11}
                >
                  <NumberField
                    label='Font size (px)'
                    name={`${focusIdx}.data.value.font-size`}
                    config={pixelAdapter}
                    autoComplete='off'
                  />
                </Grid.Col>
              </Grid.Row>

              <Grid.Row>
                <Grid.Col span={11}>
                  <InputWithUnitField
                    label={String('Line height')}
                    unitOptions='percent'
                    name={`${focusIdx}.data.value.line-height`}
                  />
                </Grid.Col>
                <Grid.Col
                  offset={1}
                  span={11}
                >
                  <InputWithUnitField
                    label={String('Font weight')}
                    unitOptions='percent'
                    name={`${focusIdx}.data.value.font-weight`}
                  />
                </Grid.Col>
              </Grid.Row>

              <Grid.Row>
                <Grid.Col span={11}>
                  <ColorPickerField
                    label={String('Text color')}
                    name={`${focusIdx}.data.value.text-color`}
                  />
                </Grid.Col>
                <Grid.Col
                  offset={1}
                  span={11}
                >
                  <ColorPickerField
                    label={String('Background')}
                    name={`${focusIdx}.attributes.background-color`}
                  />
                </Grid.Col>
              </Grid.Row>

              <Grid.Row>
                <ColorPickerField
                  label={String('Content background')}
                  name={`${focusIdx}.data.value.content-background-color`}
                />
              </Grid.Row>

              <TextAreaField
                autoSize
                label={String('User style')}
                name={`${focusIdx}.data.value.user-style.content`}
              />
              {/* @ts-ignore */}
              <Stack.Item />
              {/* @ts-ignore */}
              <Stack.Item />
              <AddFont />
              {/* @ts-ignore */}
              <Stack.Item />
              {/* @ts-ignore */}
              <Stack.Item />
            </Stack>
          </Collapse.Item>
        </Collapse>
        {/* @ts-ignore */}
      </Stack.Item>
    </AttributesPanelWrapper>
  );
}
