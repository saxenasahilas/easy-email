// Packages:
import { cloneDeep } from 'lodash';

// Functions:
const findInNode = (node: any, gridBlocks: any[]) => {
  if (['advanced_grid', 'grid'].includes(node.type)) {
    gridBlocks.push(cloneDeep(node));
    return;
  } else {
    ((node.children ?? []) as any[]).forEach(node => findInNode(node, gridBlocks));
  }
};

const getGridBlocksInJSON = (content: any) => {
  const gridBlocks: any[] = [];
  findInNode(content, gridBlocks);
  return gridBlocks;
};

// Exports:
export default getGridBlocksInJSON;
