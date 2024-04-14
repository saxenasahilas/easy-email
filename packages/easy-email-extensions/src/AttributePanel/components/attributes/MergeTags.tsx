import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Tree, TreeSelect } from '@arco-design/web-react';
import { get, isObject } from 'lodash';
import { useBlock, useEditorProps, useFocusIdx } from 'easy-email-editor';
import { getContextMergeTags } from '@extensions/utils/getContextMergeTags';

enum MergeTagModifier {
  React,
  EasyEmail,
}

const getMergeTags = () => JSON.parse(sessionStorage.getItem('mergeTags') ?? '{}');

const generateUpdateMergeTagsListener = (listenFor: MergeTagModifier, callback: (newMergeTags: Record<string, string>) => void) => (event: MessageEvent<any>) => {
  try {
    if (typeof event.data !== 'string') return;
    if (event.data.trim().length === 0) return;
    const message = JSON.parse(event.data) as any;
    if (message.modifier === listenFor) callback(message.mergeTags);
  } catch (error) {
  }
};

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
  const [mergeTags, setMergeTags] = useState<Record<string, string>>(getMergeTags());
  const updateMergeTags = generateUpdateMergeTagsListener(MergeTagModifier.React, setMergeTags);

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

    Object.keys(mergeTags).map((key) =>
      deep(key, key, mergeTags, treeData)
    );
    return treeData;
  }, [mergeTags]);

  const onSelect = useCallback(
    (key: string) => {
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
    [mergeTags, props, mergeTagGenerate]
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
    window.addEventListener('message', updateMergeTags);

    return () => {
      window.removeEventListener('message', updateMergeTags);
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
