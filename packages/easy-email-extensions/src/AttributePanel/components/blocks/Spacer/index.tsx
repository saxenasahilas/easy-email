import React from 'react';
import { Height } from '@extensions/AttributePanel/components/attributes/Height';
import { ContainerBackgroundColor } from '@extensions/AttributePanel/components/attributes/ContainerBackgroundColor';
import { Padding } from '@extensions/AttributePanel/components/attributes/Padding';
import { AttributesPanelWrapper } from '@extensions/AttributePanel/components/attributes/AttributesPanelWrapper';
import { Collapse, Grid, Space } from '@arco-design/web-react';
import { ClassName } from '../../attributes/ClassName';
import { CollapseWrapper } from '../../attributes/CollapseWrapper';
import { TextField } from '@extensions/components/Form';
import { isIDValid } from '@extensions/utils/blockIDManager';
import { useFocusIdx } from 'easy-email-editor';

export function Spacer() {
  const { focusIdx } = useFocusIdx();

  return (
    <AttributesPanelWrapper>
      <CollapseWrapper defaultActiveKey={['-1', '0', '1', '2', '3']}>
        <Collapse.Item name='1' header={t('Dimension')}>
          <Space direction='vertical'>
            <TextField
              label={(
                <Space>
                  <span>{t('ID')}</span>
                </Space>
              )}
              name={`${focusIdx}.attributes.id`}
              validate={value => isIDValid(focusIdx, value)}
            />
            <Height />
            <Padding />
          </Space>
        </Collapse.Item>

        <Collapse.Item name='2' header={t('Background')}>
          <ContainerBackgroundColor title={t('Background color')} />
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
