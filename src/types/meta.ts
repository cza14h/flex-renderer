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

type ModuleBasic = {
  components: Record<string, ComConfigs.Configs>;
  breakpoints: BreakpointsValue[];
  basics: {
    default: Record<string, BasicConfig.Combination>;
  } & Record<string, Record<string, BasicConfig.Combination>>;
  layers: LayerConfig.LayerList;
  interaction: InteractionConfig;
  filters: Record<string, FilterType>;
};

type PageMeta = {
  pageInfo: PanelConfig.PageInfo;
} & ModuleBasic;

export type MainMetaType = {
  default: PageMeta;
} & Record<string, ModuleBasic>;
