export type FlexContainerConfig = {
  height?: number;
  width?: number;
};

export type SupportedType = 'com';

type LayerItem = {
  id: string;
  children?: LayerItem[];
  type: SupportedType;
};

export type SingleLayer = LayerItem[];

export type LayerList = SingleLayer[];
