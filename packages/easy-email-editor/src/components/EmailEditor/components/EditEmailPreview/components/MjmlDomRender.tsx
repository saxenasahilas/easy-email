import React, { useEffect, useMemo, useState } from 'react';
import mjml from 'mjml-browser';
import { getPageIdx, IPage, JsonToMjml } from 'easy-email-core';
import { cloneDeep, isEqual } from 'lodash';
import { useEditorContext } from '@/hooks/useEditorContext';
import { HtmlStringToReactNodes } from '@/utils/HtmlStringToReactNodes';
import { createPortal } from 'react-dom';
import { useEditorProps } from '@/hooks/useEditorProps';
import { getEditorRoot, getShadowRoot } from '@/utils';
import { DATA_RENDER_COUNT, FIXED_CONTAINER_ID } from '@/constants';
import { AttributeModifier, generateUpdateCustomAttributeListener, generateUpdatePredefinedAttributeListener, getCustomAttributes, getPredefinedAttributes } from 'attribute-manager';

let count = 0;
export function MjmlDomRender() {
  const { pageData: content } = useEditorContext();
  const [pageData, setPageData] = useState<IPage | null>(null);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const { dashed, enabledMergeTagsBadge } = useEditorProps();
  const [isTextFocus, setIsTextFocus] = useState(false);
  const [predefinedAttributes, _setPredefinedAttributes] = useState(getPredefinedAttributes());
  const [customAttributes, _setCustomAttributes] = useState(getCustomAttributes());

  const updateCustomAttributes = generateUpdateCustomAttributeListener(AttributeModifier.EasyEmail, _setCustomAttributes);
  const updatePredefinedAttributes = generateUpdatePredefinedAttributeListener(AttributeModifier.EasyEmail, _setPredefinedAttributes);

  const isTextFocusing =
    document.activeElement === getEditorRoot() &&
    getShadowRoot().activeElement?.getAttribute('contenteditable') === 'true';

  useEffect(() => {
    if (!isTextFocus && !isEqual(content, pageData)) {
      setPageData(cloneDeep(content));
    }
  }, [content, pageData, setPageData, isTextFocus]);

  useEffect(() => {
    setIsTextFocus(isTextFocusing);
  }, [isTextFocusing]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (getEditorRoot()?.contains(e.target as Node)) {
        return;
      }
      const fixedContainer = document.getElementById(FIXED_CONTAINER_ID);
      if (fixedContainer?.contains(e.target as Node)) {
        return;
      }
      setIsTextFocus(false);
    };

    window.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('click', onClick);
    };
  }, []);

  useEffect(() => {
    const root = getShadowRoot();
    if (!root) return;
    const onClick = (e: Event) => {
      const isFocusing =
        getShadowRoot().activeElement?.getAttribute('contenteditable') === 'true';
      if (isFocusing) {
        setIsTextFocus(true);
      }
    };

    root.addEventListener('click', onClick);
    return () => {
      root.removeEventListener('click', onClick);
    };
  }, []);

  const html = useMemo(() => {
    const mergeTags = {
      ...predefinedAttributes,
      ...customAttributes,
    };

    if (!pageData) return '';

    const renderHtml = mjml(
      JsonToMjml({
        data: pageData,
        idx: getPageIdx(),
        context: pageData,
        mode: 'testing',
        dataSource: cloneDeep(mergeTags),
      }),
    ).html;
    return renderHtml;
  }, [predefinedAttributes, customAttributes, pageData]);

  useEffect(() => {
    window.addEventListener('message', updateCustomAttributes);
    window.addEventListener('message', updatePredefinedAttributes);

    return () => {
      window.removeEventListener('message', updateCustomAttributes);
      window.removeEventListener('message', updatePredefinedAttributes);
    };
  }, []);

  return useMemo(() => {
    return (
      <div
        {...{
          [DATA_RENDER_COUNT]: count++,
        }}
        data-dashed={dashed}
        ref={setRef}
        style={{
          outline: 'none',
          position: 'relative',
        }}
        role='tabpanel'
        tabIndex={0}
      >
        <>
          {ref &&
            createPortal(
              HtmlStringToReactNodes(html, {
                enabledMergeTagsBadge: Boolean(enabledMergeTagsBadge),
              }),
              ref,
            )}
        </>
      </div>
    );
  }, [dashed, ref, html, enabledMergeTagsBadge]);
}
