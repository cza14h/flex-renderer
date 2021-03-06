import type { SingleLayer } from './types';
//eslint-disable-next-line
const virtualScrollLayer: SingleLayer = [...Array(100)].map((_, i) => {
  return {
    id: `${i}`,
    type: 'com',
  };
});

const treeLayer: SingleLayer = [
  {
    id: '1',
    type: 'group',
    children: [
      {
        id: '1-1',
        type: 'com',
      },
      {
        id: '1-2',
        type: 'com',
      },
      {
        id: '1-3',
        type: 'com',
      },
      {
        id: '1-4',
        type: 'com',
      },
      {
        id: '1-5',
        type: 'com',
      },
    ],
  },
  {
    id: '2',
    type: 'group',
    children: [
      {
        id: '2-1',
        type: 'com',
      },
      {
        id: '2-2',
        type: 'com',
      },
    ],
  },
];

export default treeLayer;

const dashboardComponents = {
  '1': {},
  '1-1': {},
  '1-2': {},
  '1-3': {},
  '1-4': {},
  '1-5': {},
  '2': {},
  '2-1': {},
  '2-2': {},
};
// export default virtualScrollLayer;
