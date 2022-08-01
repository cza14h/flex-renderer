import type { ReactNode } from 'react';
import type DragContext from './dragContext';
import type { LayerConfig, CursorOffset } from '@app/types';

export type EditorPanelProps = {
  breakPoint: number;
  layerConfig: LayerConfig.ItemList;
  sortLayer(from: string[], to: string): void;
};

export type MemberIdentifier = {
  chain: string;
  id: string;
};

export type SortLayerType = (from: string[], to: string) => void;

export interface OnChildHoverType {
  (chain: string, cursorOffset: CursorOffset): string | null;
  (chain: null): void;
}

export type BoxProps = {
  id: string;
  chain: string;
  // dragEnable: boolean;
  dragContext: DragContext;
  onChildDragOver?: OnChildHoverType;
};
export type BoxState = {};

export type FlexProps = EditorRendererProps & BoxProps;
export type FlexState = EditorRendererState & BoxState;
export type NormalProps = {
  children?: ReactNode;
} & BoxProps;

export type EditorRendererProps = {
  layers: LayerConfig.ItemList;
  dragContext: DragContext;
  chain: string;
};

export type EditorRendererState = {
  ghost: string | null;
};
