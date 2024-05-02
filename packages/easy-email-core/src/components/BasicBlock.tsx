import { IBlock } from '@core/typings';
import { getAdapterAttributesString, getChildIdx } from '@core/utils';
import { getImg } from '@core/utils/getImg';
import { getPlaceholder } from '@core/utils/getPlaceholder';
import { omit } from 'lodash';
import React from 'react';
import { BlockRenderer } from './BlockRenderer';

export function BasicBlock(props: {
  params: Parameters<IBlock['render']>[0];
  tag: string;
  children?: React.ReactNode;
}) {
  const {
    params,
    params: { data, idx, children: children2, mode, dataSource },
    tag,
    children,
  } = props;

  const placeholder = data.children.length === 0 && getPlaceholder(params);

  let content = children || children2;
  if (
    (!content || (Array.isArray(content) && content.length === 0)) &&
    data.children.length === 0
  ) {
    content = placeholder;
  }

  if (mode === 'testing' && tag === 'mj-image') {
    let url = data.attributes.src;

    if (
      url === '' ||
      /{{([\s\S]+?)}}/g.test(url) ||
      /\*\|([^\|\*]+)\|\*/g.test(url)
    ) {
      const adapterData = omit(params, 'data.attributes.src');
      let src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/991px-Placeholder_view_vector.svg.png';

      // if (/{{([\s\S]+?)}}/g.test(url)) {
      //   const strippedAttributeKey = url.slice(0, -2).substring(2);
      //   const attributeValue = dataSource?.[strippedAttributeKey] ?? '';
      //   src = attributeValue;
      // }

      return (
        <>
          {`<${tag} ${getAdapterAttributesString(adapterData)} src="${src}">`}

          {`</${tag}>`}
        </>
      );
    }
  }

  return (
    <>
      {`<${tag} ${getAdapterAttributesString(params)}>`}
      {content ||
        data.children.map((child, index) => (
          <BlockRenderer
            key={index}
            {...params}
            idx={idx ? getChildIdx(idx, index) : null}
            data={child}
          />
        ))}
      {`</${tag}>`}
    </>
  );
}
