import { ShortcutToolbar } from '../ShortcutToolbar';
import { Button, Card, ConfigProvider, Layout, Tabs } from '@arco-design/web-react';
import { useEditorProps } from 'easy-email-editor';
import React, { useState } from 'react';
import { SourceCodePanel } from '../SourceCodePanel';
import { AttributePanel } from '../AttributePanel';
import { BlockLayer, BlockLayerProps } from '../BlockLayer';
import { InteractivePrompt } from '../InteractivePrompt';
import styles from './index.module.scss';
import enUS from '@arco-design/web-react/es/locale/en-US';
import { MergeTagBadgePrompt } from '@extensions/MergeTagBadgePrompt';
import { IconLeft, IconRight } from '@arco-design/web-react/icon';

export const SimpleLayout: React.FC<
  {
    showSourceCode?: boolean;
    jsonReadOnly?: boolean;
    mjmlReadOnly?: boolean;
    defaultShowLayer?: boolean;
    children: React.ReactNode | React.ReactElement;
  } & BlockLayerProps
> = props => {
  const { height: containerHeight } = useEditorProps();
  const { showSourceCode = true, defaultShowLayer = true, jsonReadOnly = false, mjmlReadOnly = true } = props;
  const [collapsed, setCollapsed] = useState(!defaultShowLayer);
  return (
    // @ts-ignore
    <ConfigProvider locale={enUS}>
      {/* @ts-ignore */}
      <Layout
        className={styles.SimpleLayout}
        style={{
          display: 'flex',
          width: '100%',
          overflow: 'hidden',
          minWidth: 1400,
        }}
      >
        {/* @ts-ignore */}
        <Layout.Sider
          style={{ paddingRight: 0 }}
          collapsed={collapsed}
          collapsible
          trigger={null}
          breakpoint='xl'
          collapsedWidth={60}
          width={300}
        >
          {/* @ts-ignore */}
          <Card
            bodyStyle={{ padding: 0 }}
            style={{ border: 'none' }}
          >
            {/* @ts-ignore */}
            <Card.Grid style={{ width: 60, textAlign: 'center' }}>
              {/* @ts-ignore */}
              <ShortcutToolbar />
              {/* @ts-ignore */}
              <Button
                style={{
                  marginTop: 30,
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
                // @ts-ignore
                icon={collapsed ? <IconRight /> : <IconLeft />}
                shape='round'
                onClick={() => setCollapsed(v => !v)}
              />
            </Card.Grid>
            {/* @ts-ignore */}
            <Card.Grid
              className={styles.customScrollBar}
              style={{
                flex: 1,
                paddingBottom: 50,
                border: 'none',
                height: containerHeight,
                overflowY: 'auto',
                overflowX: 'hidden',
              }}
            >
              {/* @ts-ignore */}
              <Card
                title={'Layout'}
                style={{ border: 'none' }}
                headerStyle={{ height: 50 }}
              >
                {/* @ts-ignore */}
                {!collapsed && <BlockLayer renderTitle={props.renderTitle} />}
              </Card>
            </Card.Grid>
          </Card>
        </Layout.Sider>

        {/* @ts-ignore */}
        <Layout style={{ height: containerHeight }}>{props.children}</Layout>
        {/* @ts-ignore */}
        <Layout.Sider
          style={{
            height: containerHeight,
            minWidth: 300,
            maxWidth: 350,
            width: 350,
          }}
          className={styles.rightSide}
        >
          {/* @ts-ignore */}
          <Card
            size='small'
            id='rightSide'
            style={{
              maxHeight: '100%',
              height: '100%',
              borderLeft: 'none',
            }}
            bodyStyle={{ padding: 0 }}
            className={styles.customScrollBarV2}
          >
            {/* @ts-ignore */}
            <Tabs className={styles.layoutTabs}>
              {/* @ts-ignore */}
              <Tabs.TabPane
                title={
                  <div style={{ height: 31, lineHeight: '31px' }}>
                    {'Configuration'}
                  </div>
                }
              >
                {/* @ts-ignore */}
                <AttributePanel />
              </Tabs.TabPane>
              {showSourceCode && (
                // @ts-ignore
                <Tabs.TabPane
                  destroyOnHide
                  key='Source code'
                  title={
                    <div style={{ height: 31, lineHeight: '31px' }}>
                      {'Source code'}
                    </div>
                  }
                >
                  {/* @ts-ignore */}
                  <SourceCodePanel jsonReadOnly={jsonReadOnly} mjmlReadOnly={mjmlReadOnly} />
                </Tabs.TabPane>
              )}
            </Tabs>
          </Card>
        </Layout.Sider>

        {/* @ts-ignore */}
        <InteractivePrompt />
        {/* @ts-ignore */}
        <MergeTagBadgePrompt />
      </Layout>
    </ConfigProvider>
  );
};
