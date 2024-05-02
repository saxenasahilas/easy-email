import { omit } from 'lodash';
import { BasicType } from '@core/constants';
import { RecursivePartial } from '@core/typings';
import React from 'react';
import { IGrid } from '@core/blocks';
import MjmlBlock, { MjmlBlockProps } from '@core/components/MjmlBlock';

export type GridProps = RecursivePartial<IGrid['data']> &
  RecursivePartial<IGrid['attributes']> & {
    children?: MjmlBlockProps<IGrid>['children'];
  };

export function Grid(props: GridProps) {
  return (
    <MjmlBlock
      attributes={omit(props, ['data', 'children', 'value'])}
      value={props.value}
      type={BasicType.GRID}
    >
      {props.children}
    </MjmlBlock>
  );
}
