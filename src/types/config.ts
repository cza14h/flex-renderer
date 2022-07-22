import { CSSProperties } from 'react';

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

export type CanvasItemType = 'com' | 'group' | 'subcom' | 'logical' | 'subpanel';

export type LayerItem = {
  id: string;
  children?: LayerItem[];
  type: CanvasItemType;
};

export type BasicConfig = {
  height?: string;
  width?: string;
  maxHeight?: string;
  minHeight?: string;
  maxWidth?: string;
  minWidth?: string;
  flexGrow?: number;
  flexShrink?: number;
  //TODO Padding margin border
  // paddingLeft: CSSProperties['paddingLeft'];
};

export type SingleLayer = LayerItem[];

export type LayerList = SingleLayer[];

type ComIdentifier = {
  category: string; // 组件分类
  name: string; //组件名称 eg:txt
  version: string; // 组件版本
  icon: string; //组件图标
  user: string | null;
};

type BasicComConfig = {};

export type ConfigType<Basic extends BasicConfig = BasicConfig> = {
  attr?: Record<string, any>;
};
