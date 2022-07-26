export type PanelStatus = 'default' | string;

export type Actives = Record<string, string>;

export type ScaleType = number;

export enum EditorStatus {
  flex = 'flex',
  interaction = 'interaction',
}

export type LayoutStatus = {
  layerPanel: boolean;
  componentPanel: boolean;
  toolboxPanel: boolean;
  configPanel: boolean;
  importNodePanel: boolean;
  logicalNodePanel: boolean;
  nodeToolboxPanel: boolean;
  nodeConfigPanel: boolean;
};
export type LayoutPanelName = keyof LayoutStatus;
