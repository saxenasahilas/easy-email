import { Collapse, Input, Message } from '@arco-design/web-react';
import {
  BasicType,
  BlockManager,
  getPageIdx,
  getParentByIdx,
  IBlockData,
  JsonToMjml,
} from 'easy-email-core';
import {
  useBlock,
  useFocusIdx,
  useEditorContext,
} from 'easy-email-editor';
import { cloneDeep } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MjmlToJson } from '@extensions/utils/MjmlToJson';
import styles from './index.module.scss';
import { AttributeModifier, generateUpdateCustomAttributeListener, generateUpdatePredefinedAttributeListener, getCustomAttributes, getPredefinedAttributes } from 'attribute-manager';

export function SourceCodePanel({ jsonReadOnly, mjmlReadOnly }: { jsonReadOnly: boolean; mjmlReadOnly: boolean; }) {
  const { setValueByIdx, focusBlock, values } = useBlock();
  const { focusIdx } = useFocusIdx();

  const [mjmlText, setMjmlText] = useState('');
  const { pageData } = useEditorContext();
  const [predefinedAttributes, _setPredefinedAttributes] = useState(getPredefinedAttributes());
  const [customAttributes, _setCustomAttributes] = useState(getCustomAttributes());

  const updateCustomAttributes = generateUpdateCustomAttributeListener(AttributeModifier.EasyEmail, _setCustomAttributes);
  const updatePredefinedAttributes = generateUpdatePredefinedAttributeListener(AttributeModifier.EasyEmail, _setPredefinedAttributes);

  const code = useMemo(() => {
    if (!focusBlock) return '';
    return JSON.stringify(focusBlock, null, 2) || '';
  }, [focusBlock]);

  const onChangeCode = useCallback(
    (event: React.FocusEvent<HTMLTextAreaElement>) => {
      if (!jsonReadOnly) {
        try {
          const parseValue = JSON.parse(
            JSON.stringify(eval('(' + event.target.value + ')')),
          ) as IBlockData;

          const block = BlockManager.getBlockByType(parseValue.type);
          if (!block) {
            throw new Error('Invalid content');
          }
          if (
            !parseValue.data ||
            !parseValue.data.value ||
            !parseValue.attributes ||
            !Array.isArray(parseValue.children)
          ) {
            throw new Error('Invalid content');
          }
          setValueByIdx(focusIdx, parseValue);
        } catch (error: any) {
          Message.error(error?.message || error);
        }
      }
    },
    [focusIdx, setValueByIdx],
  );

  const onMjmlChange = useCallback(
    (event: React.FocusEvent<HTMLTextAreaElement>) => {
      if (!mjmlReadOnly) {
        try {
          const parseValue = MjmlToJson(event.target.value);
          if (parseValue.type !== BasicType.PAGE) {
            // @ts-ignore
            const parentBlock = getParentByIdx(values, focusIdx)!;
            const parseBlock = BlockManager.getBlockByType(parseValue.type);

            if (!parseBlock?.validParentType.includes(parentBlock?.type)) {
              throw new Error('Invalid content');
            }
          } else if (focusIdx !== getPageIdx()) {
            throw new Error('Invalid content');
          }

          setValueByIdx(focusIdx, parseValue);
        } catch (error) {
          Message.error('Invalid content');
        }
      }
    },
    [focusIdx, setValueByIdx, values],
  );

  const onChangeMjmlText = useCallback((value: string) => {
    setMjmlText(value);
  }, []);

  useEffect(() => {
    const mergeTags = {
      ...predefinedAttributes,
      ...customAttributes,
    };
    focusBlock &&
      setMjmlText(
        JsonToMjml({
          idx: focusIdx,
          data: focusBlock,
          context: pageData,
          mode: 'production',
          dataSource: cloneDeep(mergeTags),
        }),
      );
  }, [focusBlock, focusIdx, pageData, predefinedAttributes, customAttributes]);

  useEffect(() => {
    window.addEventListener('message', updateCustomAttributes);
    window.addEventListener('message', updatePredefinedAttributes);

    return () => {
      window.removeEventListener('message', updateCustomAttributes);
      window.removeEventListener('message', updatePredefinedAttributes);
    };
  }, []);

  if (!focusBlock) return null;

  return (
    // @ts-ignore
    <Collapse>
      <Collapse.Item
        name='json'
        header={'Json source'}
        contentStyle={{ padding: '8px 13px' }}
      >
        <Input.TextArea
          key={code}
          defaultValue={code}
          autoSize={{ maxRows: 25 }}
          onBlur={onChangeCode}
          readOnly={jsonReadOnly}
          className={styles.customTextArea}
        />
      </Collapse.Item>
      <Collapse.Item
        name='mjml'
        header={'MJML source'}
        contentStyle={{ padding: '8px 13px' }}
      >
        <Input.TextArea
          key={code}
          value={mjmlText}
          autoSize={{ maxRows: 25 }}
          onChange={onChangeMjmlText}
          onBlur={onMjmlChange}
          readOnly={mjmlReadOnly}
          className={styles.customTextArea}
        />
      </Collapse.Item>
    </Collapse>
  );
}
