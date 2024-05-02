import React from 'react';

import { Collapse, Grid as _Grid, Space, Dropdown } from '@arco-design/web-react';
import { AttributesPanelWrapper } from '@extensions/AttributePanel/components/attributes/AttributesPanelWrapper';
import { Padding } from '@extensions/AttributePanel/components/attributes/Padding';
import { Width } from '@extensions/AttributePanel/components/attributes/Width';
import { VerticalAlign } from '@extensions/AttributePanel/components/attributes/VerticalAlign';
import { Background } from '@extensions/AttributePanel/components/attributes/Background';
import { Border } from '@extensions/AttributePanel/components/attributes/Border';
import { ClassName } from '../../attributes/ClassName';
import { CollapseWrapper } from '../../attributes/CollapseWrapper';
import { BackgroundColor } from '../../attributes';
import { Stack, useFocusIdx } from 'easy-email-editor';
import { SelectField, TextField } from '@extensions/components/Form';
import { isIDValid } from '@extensions/utils/blockIDManager';
import { isNumber } from '@extensions/AttributePanel/utils/InputNumberAdapter';

export function Grid() {
  const { focusIdx } = useFocusIdx();

  return (
    <AttributesPanelWrapper>
      <CollapseWrapper defaultActiveKey={['-1', '0', '1', '2']}>
        <Collapse.Item name='-1' header={String('Settings')}>
          {/* @ts-ignore */}
          <Stack vertical>
            <TextField
              label={(
                <Space>
                  <span>{String('ID')}</span>
                </Space>
              )}
              name={`${focusIdx}.attributes.data-id`}
              validate={value => isIDValid(focusIdx, value)}
              style={{
                paddingBottom: '1rem',
              }}
            />
          </Stack>
          {/* @ts-ignore */}
          <Stack vertical>
            <SelectField
              label={(
                <Space>
                  <span>{String('Direction')}</span>
                </Space>
              )}
              name={`${focusIdx}.attributes.data-direction`}
              options={[
                { value: 'row', label: 'Row' },
                { value: 'column', label: 'Column' },
              ]}
              style={{
                width: '100%',
                paddingBottom: '1rem',
              }}
            />
          </Stack>
          {/* @ts-ignore */}
          <Stack vertical>
            <TextField
              label={(
                <Space>
                  <span>{String('Threshold')}</span>
                </Space>
              )}
              name={`${focusIdx}.attributes.data-threshold`}
              validate={value => (value?.trim()?.length ?? 0) > 0 && isNaN(parseInt(value)) ? 'Please enter a number!' : undefined}
              style={{
                paddingBottom: '1rem',
              }}
            />
          </Stack>
          {/* @ts-ignore */}
          <Stack vertical>
            <TextField
              label={(
                <Space>
                  <span>{String('Data Source')}<span style={{ color: 'red' }}>*</span></span>
                </Space>
              )}
              name={`${focusIdx}.attributes.data-source`}
              validate={value => (value?.trim()?.length ?? 0) > 0 ? undefined : 'Please enter the name of the data source!'}
              style={{
                paddingBottom: '1rem',
              }}
            />
          </Stack>
        </Collapse.Item>
        <Collapse.Item
          name='0'
          header={String('Dimension')}
        >
          <Space direction='vertical'>
            <_Grid.Row>
              <_Grid.Col span={11}>
                <Width />
              </_Grid.Col>
              <_Grid.Col
                offset={1}
                span={11}
              >
                <VerticalAlign />
              </_Grid.Col>
            </_Grid.Row>

            <Padding />
          </Space>
        </Collapse.Item>
        <Collapse.Item
          name='1'
          header={String('Background')}
        >
          <BackgroundColor />
        </Collapse.Item>
        <Collapse.Item
          name='2'
          header={String('Border')}
        >
          <Border />
        </Collapse.Item>
        <Collapse.Item
          name='4'
          header={String('Extra')}
        >
          <_Grid.Col span={24}>
            <ClassName />
          </_Grid.Col>
        </Collapse.Item>
      </CollapseWrapper>
    </AttributesPanelWrapper>
  );
}
