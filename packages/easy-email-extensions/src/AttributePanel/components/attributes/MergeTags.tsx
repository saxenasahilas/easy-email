import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Tree, TreeSelect } from '@arco-design/web-react';
import { get, isObject } from 'lodash';
import { useEditorProps } from 'easy-email-editor';
import { AttributeModifier, generateUpdateCustomAttributeListener, generateUpdatePredefinedAttributeListener, getCustomAttributes, getPredefinedAttributes } from 'attribute-manager';

export const MergeTags: React.FC<{
  onChange: (v: string) => void;
  value: string;
  isSelect?: boolean;
}> = React.memo((props) => {
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const {
    mergeTagGenerate,
    renderMergeTagContent,
  } = useEditorProps();
  const [predefinedAttributes, _setPredefinedAttributes] = useState(getPredefinedAttributes());
  const [customAttributes, _setCustomAttributes] = useState(getCustomAttributes());

  const updateCustomAttributes = generateUpdateCustomAttributeListener(AttributeModifier.EasyEmail, _setCustomAttributes);
  const updatePredefinedAttributes = generateUpdatePredefinedAttributeListener(AttributeModifier.EasyEmail, _setPredefinedAttributes);

  const treeOptions = useMemo(() => {
    const treeData: Array<{
      key: any;
      value: any;
      title: string;
      children: never[];
    }> = [];
    const deep = (
      key: string,
      title: string,
      parent: { [key: string]: any; children?: any[]; },
      mapData: Array<any> = []
    ) => {
      const currentMapData = {
        key: key,
        value: key,
        title: title,
        children: [],
      };

      mapData.push(currentMapData);
      const current = parent[title];
      if (current && typeof current === 'object') {
        Object.keys(current).map((childKey) =>
          deep(key + '.' + childKey, childKey, current, currentMapData.children)
        );
      }
    };

    const mergeTags = {
      ...predefinedAttributes,
      ...customAttributes,
    };

    Object.keys(mergeTags).map((key) =>
      deep(key, key, mergeTags, treeData)
    );
    return treeData;
  }, [predefinedAttributes, customAttributes]);

  const onSelect = useCallback(
    (key: string) => {
      const mergeTags = {
        ...predefinedAttributes,
        ...customAttributes,
      };

      const value = get(mergeTags, key);
      if (isObject(value)) {
        setExpandedKeys((keys) => {
          if (keys.includes(key)) {
            return keys.filter((k) => k !== key);
          } else {
            return [...keys, key];
          }
        });
        return;
      }
      return props.onChange(mergeTagGenerate(key));
    },
    [predefinedAttributes, customAttributes, props, mergeTagGenerate]
  );

  const mergeTagContent = useMemo(
    () =>
      renderMergeTagContent ? (
        renderMergeTagContent({
          onChange: props.onChange,
          isSelect: Boolean(props.isSelect),
          value: props.value,
        })
      ) : (
        <></>
      ),
    [renderMergeTagContent, props.onChange, props.isSelect, props.value]
  );

  useEffect(() => {
    window.addEventListener('message', updateCustomAttributes);
    window.addEventListener('message', updatePredefinedAttributes);

    return () => {
      window.removeEventListener('message', updateCustomAttributes);
      window.removeEventListener('message', updatePredefinedAttributes);
    };
  }, []);

  if (renderMergeTagContent) {
    return <>{mergeTagContent}</>;
  }

  return (
    <div style={{ color: '#333' }}>
      {props.isSelect ? (
        <TreeSelect
          value={props.value}
          size='small'
          dropdownMenuStyle={{ maxHeight: 400, overflow: 'auto' }}
          placeholder={t('Please select')}
          treeData={treeOptions}
          onChange={(val) => onSelect(val)}
        />
      ) : (
        <Tree
          expandedKeys={expandedKeys}
          onExpand={setExpandedKeys}
          selectedKeys={[]}
          treeData={treeOptions}
          onSelect={(vals: any[]) => onSelect(vals[0])}
          style={{
            maxHeight: 400,
            overflow: 'auto',
          }}
        />
      )}
    </div>
  );
});
