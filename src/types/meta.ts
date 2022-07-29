import { BasicConfig, ComConfigs, LayerConfig, PanelConfig } from './config';
import type { Edge as BaseEdgeType } from 'tail-js';
import type { NodeConfigs } from './config';

type InteractionConfig = {
  nodes: Record<string, NodeConfigs.DefaultNode>;
  edges: Record<string, BaseEdgeType>;
};

type FilterType = {
  id: string;
  name: string;
  content: string;
  createTime?: number;
  updateTime?: number;
};

type BreakpointsValue =
  | {
      id: string;
      lower: number;
    }
  | { id: 'default'; lower: 0 };

type MetaBasicConfig = Record<string, BasicConfig.Combination>;
export type ModuleBasic<T = PanelConfig.PageInfo> = {
  components: Record<string, ComConfigs.Configs>;
  breakpoints: BreakpointsValue[];
  basics: {
    default: MetaBasicConfig;
  } & Record<string, MetaBasicConfig>;
  layers: LayerConfig.LayerList;
  interaction: InteractionConfig;
  filters: Record<string, FilterType>;
  info: T;
};

export type PageMeta = ModuleBasic<PanelConfig.PageInfo>;

export type MainMetaType = {
  default: PageMeta;
} & Record<string, ModuleBasic<PanelConfig.CanvasModule>>;
