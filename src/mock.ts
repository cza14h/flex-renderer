import type { LayerConfig, ModuleBasic } from './types';
//eslint-disable-next-line
const virtualScrollLayer: LayerConfig.ItemList = [...Array(100)].map((_, i) => {
  return {
    id: `${i}`,
    type: 'com',
  };
});

const treeLayer: LayerConfig.ItemList = [
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
  { id: '3', type: 'com' },
];

export default treeLayer;

export const components: ModuleBasic['components'] = {
  '1': {
    id: '1',
    cn_name: '盒子',
    type: 'group',
  },
  '1-1': {
    id: '1-1',
    cn_name: '盒子',
    type: 'com',
    attr: {},
  },
  '1-2': {
    id: '1-2',
    cn_name: '盒子',
    type: 'com',
    attr: {},
  },
  '1-3': {
    id: '1-3',
    cn_name: '盒子',
    type: 'com',
    attr: {},
  },
  '1-4': {
    id: '1-4',
    cn_name: '盒子',
    type: 'com',
    attr: {},
  },
  '1-5': {
    id: '1-5',
    cn_name: '盒子',
    type: 'com',
    attr: {},
  },
  '2': {
    id: '2',
    cn_name: '盒子',
    type: 'group',
  },
  '2-1': {
    id: '2-1',
    cn_name: '盒子',
    type: 'com',
    attr: {},
  },
  '2-2': {
    id: '2-2',
    cn_name: '盒子',
    type: 'com',
    attr: {},
  },
  '3': {
    id: '3',
    cn_name: '盒子',
    type: 'com',
    attr: {},
  },
} as const;

export const breakpoints = [{ id: 'default', lower: 0 }];

export const basics = {
  default: {
    '1': {
      flexDirection: 'row',
      flexWrap: 'nowrap',
      alignItems: 'normal',
      justifyContent: 'normal',
      minWidth: null,
      minHeight: '50px',
      height: null,
      width: null,
      maxHeight: null,
      maxWidth: null,
      flexGrow: 1,
      flexShrink: 1,
      deg: 0,
      opacity: 1,
    },
    '1-1': {
      minWidth: null,
      minHeight: '50px',
      height: null,
      width: null,
      maxHeight: null,
      maxWidth: null,
      flexGrow: 1,
      flexShrink: 1,
      deg: 0,
      opacity: 1,
    },
    '1-2': {
      minWidth: null,
      minHeight: '50px',
      height: null,
      width: null,
      maxHeight: null,
      maxWidth: null,
      flexGrow: 1,
      flexShrink: 1,
      deg: 0,
      opacity: 1,
    },
    '1-3': {
      minWidth: null,
      minHeight: '50px',
      height: null,
      width: null,
      maxHeight: null,
      maxWidth: null,
      flexGrow: 1,
      flexShrink: 1,
      deg: 0,
      opacity: 1,
    },
    '1-4': {
      minWidth: null,
      minHeight: '50px',
      height: null,
      width: null,
      maxHeight: null,
      maxWidth: null,
      flexGrow: 1,
      flexShrink: 1,
      deg: 0,
      opacity: 1,
    },
    '1-5': {
      minWidth: null,
      minHeight: '50px',
      height: null,
      width: null,
      maxHeight: null,
      maxWidth: null,
      flexGrow: 1,
      flexShrink: 1,
      deg: 0,
      opacity: 1,
    },
    '2': {
      flexDirection: 'row',
      flexWrap: 'nowrap',
      alignItems: 'normal',
      justifyContent: 'normal',
      minWidth: null,
      minHeight: '50px',
      height: null,
      width: null,
      maxHeight: null,
      maxWidth: null,
      flexGrow: 1,
      flexShrink: 1,
      deg: 0,
      opacity: 1,
    },
    '2-1': {
      minWidth: null,
      minHeight: '50px',
      height: null,
      width: null,
      maxHeight: null,
      maxWidth: null,
      flexGrow: 1,
      flexShrink: 1,
      deg: 0,
      opacity: 1,
    },
    '2-2': {
      minWidth: null,
      minHeight: '50px',
      height: null,
      width: null,
      maxHeight: null,
      maxWidth: null,
      flexGrow: 1,
      flexShrink: 1,
      deg: 0,
      opacity: 1,
    },
    '3': {
      minWidth: '100px',
      minHeight: '50px',
      height: null,
      width: null,
      maxHeight: null,
      maxWidth: null,
      flexGrow: 1,
      flexShrink: 0,
      deg: 0,
      opacity: 1,
    },
  },
} as const;
// export default virtualScrollLayer;
