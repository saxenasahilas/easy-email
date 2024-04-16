import React from 'react';

import { Collapse, Grid, Space } from '@arco-design/web-react';
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
import { TextField } from '@extensions/components/Form';
import { isIDValid } from '@extensions/utils/blockIDManager';

export function Column() {
  const { focusIdx } = useFocusIdx();

  return (
    <AttributesPanelWrapper>
      <CollapseWrapper defaultActiveKey={['-1', '0', '1', '2']}>
        <Collapse.Item name='-1' header={t('Settings')}>
          <Stack vertical spacing='tight'>
            <TextField
              label={(
                <Space>
                  <span>{t('ID')}</span>
                </Space>
              )}
              name={`${focusIdx}.attributes.id`}
              validate={value => isIDValid(focusIdx, value)}
              style={{
                paddingBottom: '1rem',
              }}
            />
          </Stack>
        </Collapse.Item>
        <Collapse.Item
          name='0'
          header={t('Dimension')}
        >
          <Space direction='vertical'>
            <Grid.Row>
              <Grid.Col span={11}>
                <Width />
              </Grid.Col>
              <Grid.Col
                offset={1}
                span={11}
              >
                <VerticalAlign />
              </Grid.Col>
            </Grid.Row>

            <Padding />
          </Space>
        </Collapse.Item>
        <Collapse.Item
          name='1'
          header={t('Background')}
        >
          <BackgroundColor />
        </Collapse.Item>
        <Collapse.Item
          name='2'
          header={t('Border')}
        >
          <Border />
        </Collapse.Item>
        <Collapse.Item
          name='4'
          header={t('Extra')}
        >
          <Grid.Col span={24}>
            <ClassName />
          </Grid.Col>
        </Collapse.Item>
      </CollapseWrapper>
    </AttributesPanelWrapper>
  );
}
