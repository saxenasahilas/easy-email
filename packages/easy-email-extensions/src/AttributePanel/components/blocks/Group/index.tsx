import React from 'react';
import { Width } from '@extensions/AttributePanel/components/attributes/Width';
import { BackgroundColor } from '@extensions/AttributePanel/components/attributes/BackgroundColor';
import { VerticalAlign } from '@extensions/AttributePanel/components/attributes/VerticalAlign';
import { Collapse, Grid, Space } from '@arco-design/web-react';
import { AttributesPanelWrapper } from '@extensions/AttributePanel/components/attributes/AttributesPanelWrapper';
import { ClassName } from '../../attributes/ClassName';
import { CollapseWrapper } from '../../attributes/CollapseWrapper';
import { Stack, useFocusIdx } from '@';
import { TextField } from '@extensions/components/Form';
import { isIDValid } from '@extensions/utils/blockIDManager';

export function Group() {
  const { focusIdx } = useFocusIdx();

  return (
    <AttributesPanelWrapper>
      <CollapseWrapper defaultActiveKey={['0', '1', '2']}>
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
        <Collapse.Item name='0' header={t('Dimension')}>
          <Grid.Row>
            <Grid.Col span={11}>
              <Width />
            </Grid.Col>
            <Grid.Col offset={1} span={11}>
              <VerticalAlign />
            </Grid.Col>
          </Grid.Row>
        </Collapse.Item>
        <Collapse.Item name='1' header={t('Background')}>
          <Grid.Row>
            <Grid.Col span={11}>
              <BackgroundColor />
            </Grid.Col>
            <Grid.Col offset={1} span={11} />
          </Grid.Row>
        </Collapse.Item>
        <Collapse.Item name='4' header={t('Extra')}>
          <Grid.Col span={24}>
            <ClassName />
          </Grid.Col>
        </Collapse.Item>
      </CollapseWrapper>
    </AttributesPanelWrapper>
  );
}
