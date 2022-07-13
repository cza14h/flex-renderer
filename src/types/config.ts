
export type FlexContainerConfig = {
  height?: number;
  width?: number;
};

type SupportedType = 'com';

type LayerItem = {
  id: string;
  parent: string | null;
  children?: LayerItem[];
  type: SupportedType;
};

export type SingleLayer = LayerItem[];

export type LayerList = SingleLayer[];
