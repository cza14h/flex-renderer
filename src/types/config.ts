export type FlexContainerConfig = {
  direction: 'column' | 'row' | 'row-reverse' | 'column-reverse';
  wrap: 'nowrap' | 'wrap' | 'wrap-reverse';
  alignItems: 'normal' | 'center' | 'flex-start' | 'flex-end';
  justifyContent:
    | 'normal'
    | 'flex-start'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | 'flex-end';
} & BasicConfig;

export type SupportedType = 'com' | 'group';

export type LayerItem = {
  id: string;
  children?: LayerItem[];
  type: SupportedType;
};

export type BasicConfig = {
  height?: number;
  width?: number;
  maxHeight?: number;
  minHeight?: number;
  maxWidth?: number;
  minWidth?: number;
  grow?: number;
  shrink?: number;
};

export type SingleLayer = LayerItem[];

export type LayerList = SingleLayer[];
