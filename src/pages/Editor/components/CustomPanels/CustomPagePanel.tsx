// Packages:
import React, { useState } from 'react';
import { pixelAdapter } from '../../../../utils/adapter';
import useMergeTags from '../useMergeTags';
import { cloneDeep, set } from 'lodash';

// Typescript:
interface PageProps {
  hideSubTitle?: boolean;
  hideSubject?: boolean;
}

// Imports:
import { IconPlus } from '@arco-design/web-react/icon';

// Components:
import { Collapse, Grid, Input, Space, Tag } from '@arco-design/web-react';
import { Stack, useFocusIdx } from 'easy-email-editor';
import {
  AttributesPanelWrapper,
  ColorPickerField,
  FontFamily,
  InputWithUnitField,
  NumberField,
  TextAreaField,
  TextField,
} from 'easy-email-extensions';

// Functions:
const CustomPagePanel = ({ hideSubTitle, hideSubject }: PageProps) => {
  // Constants:
  const { focusIdx } = useFocusIdx();
  const { mergeTags, setMergeTags } = useMergeTags();

  // State:
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // Functions:
  const addMergeTag = () => {
    const isMergeTagAlreadyPresent = Object.keys(mergeTags).some(mergeTag => mergeTag === inputValue);
    if (inputValue && !isMergeTagAlreadyPresent) {
      setMergeTags(_mergeTags => {
        const mergeTags = cloneDeep(_mergeTags);
        set(mergeTags, inputValue, '');
        return mergeTags;
      });
      setInputValue('');
    }

    setShowInput(false);
  };

  const removeMergeTag = (mergeTagToRemove: string) => {
    const newMergeTags = cloneDeep(mergeTags);
    const isMergeTagPresent = Object.keys(mergeTags).some(mergeTag => mergeTag === mergeTagToRemove);
    if (isMergeTagPresent) {
      delete newMergeTags[mergeTagToRemove];
      setMergeTags(newMergeTags);
    }
  };

  // Return:
  if (!focusIdx) return null;

  return (
    <AttributesPanelWrapper style={{ padding: 0 }}>
      <Stack.Item fill>
        <Collapse defaultActiveKey={['0', '1']}>
          <Collapse.Item
            name='0'
            header={t('Email Setting')}
          >
            <Space direction='vertical'>
              {!hideSubject && (
                <TextField
                  label={t('Subject')}
                  name={'subject'}
                  inline
                />
              )}
              {!hideSubTitle && (
                <TextField
                  label={t('Subtitle')}
                  name={'subTitle'}
                  inline
                />
              )}
              <InputWithUnitField
                label={t('Width')}
                name={`${focusIdx}.attributes.width`}
                inline
              />
              <InputWithUnitField
                label={t('Breakpoint')}
                helpText={t(
                  'Allows you to control on which breakpoint the layout should go desktop/mobile.',
                )}
                name={`${focusIdx}.data.value.breakpoint`}
                inline
              />
            </Space>
          </Collapse.Item>
          <Collapse.Item
            name='1'
            header={t('Theme Setting')}
          >
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
                    label={t('Line height')}
                    unitOptions='percent'
                    name={`${focusIdx}.data.value.line-height`}
                  />
                </Grid.Col>
                <Grid.Col
                  offset={1}
                  span={11}
                >
                  <InputWithUnitField
                    label={t('Font weight')}
                    unitOptions='percent'
                    name={`${focusIdx}.data.value.font-weight`}
                  />
                </Grid.Col>
              </Grid.Row>

              <Grid.Row>
                <Grid.Col span={11}>
                  <ColorPickerField
                    label={t('Text color')}
                    name={`${focusIdx}.data.value.text-color`}
                  />
                </Grid.Col>
                <Grid.Col
                  offset={1}
                  span={11}
                >
                  <ColorPickerField
                    label={t('Background')}
                    name={`${focusIdx}.attributes.background-color`}
                  />
                </Grid.Col>
              </Grid.Row>

              <Grid.Row>
                <ColorPickerField
                  label={t('Content background')}
                  name={`${focusIdx}.data.value.content-background-color`}
                />
              </Grid.Row>

              <TextAreaField
                autoSize
                label={t('User style')}
                name={`${focusIdx}.data.value.user-style.content`}
              />
              <Stack.Item />
              <Stack.Item />

              <Space size={20}>
                {Object.keys(mergeTags).map(tag => {
                  return (
                    <Tag
                      key={tag}
                      closable
                      onClose={() => removeMergeTag(tag)}
                    >
                      {tag}
                    </Tag>
                  );
                })}
                {showInput ? (
                  <Input
                    autoFocus
                    size='mini'
                    value={inputValue}
                    style={{ width: 84 }}
                    onPressEnter={addMergeTag}
                    onBlur={addMergeTag}
                    onChange={setInputValue}
                  />
                ) : (
                  <Tag
                    icon={<IconPlus />}
                    style={{
                      width: 'auto',
                      backgroundColor: 'var(--color-fill-2)',
                      border: '1px dashed var(--color-fill-3)',
                      cursor: 'pointer',
                    }}
                    className='add-tag'
                    tabIndex={0}
                    onClick={() => setShowInput(true)}
                    onKeyDown={event => {
                      if (event.key === 'Enter') { // enter
                        setShowInput(true);
                      }
                    }}
                  >
                    Add Merge Tag
                  </Tag>
                )}
              </Space>

              <Stack.Item />
              <Stack.Item />
            </Stack>
          </Collapse.Item>
        </Collapse>
      </Stack.Item>
    </AttributesPanelWrapper>
  );
};

// Exports:
export default CustomPagePanel;
