// 'use client';

// // Packages:
// import React from 'react';
// import { BlockManager } from 'easy-email-core';
// import { BlockAttributeConfigurationManager, BlockMarketManager, BlockMaskWrapper } from 'easy-email-extensions';

// // Constants:
// import { CustomBlocksType } from './constants';

// // Components:
// import GridBlock from './Grid/Block';
// import GridPanel from './Grid/Panel';

// // Functions:
// BlockManager.registerBlocks({ [CustomBlocksType.GRID_BLOCK]: GridBlock });

// BlockAttributeConfigurationManager.add({
//   [CustomBlocksType.GRID_BLOCK]: GridPanel
// });

// BlockMarketManager.addCategories([
//   {
//     title: 'Grid',
//     name: 'Grid',
//     blocks: [
//       {
//         type: CustomBlocksType.GRID_BLOCK,
//         title: 'Grid block',
//         description: 'Add repeatable components within grid block',
//         component: () => (
//           // @ts-ignore
//           <BlockMaskWrapper
//             type={CustomBlocksType.GRID_BLOCK as any}
//             payload={{}}
//           >
//             <div style={{ position: 'relative' }}>
//               <img src={'https://cdn-icons-png.flaticon.com/512/3603/3603069.png'} style={{ maxWidth: '100%' }} />
//               <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2 }} />
//             </div>
//           </BlockMaskWrapper>
//         ),
//         thumbnail:
//           'https://cdn-icons-png.flaticon.com/512/3603/3603069.png',
//       },
//     ],
//   }
// ]);
