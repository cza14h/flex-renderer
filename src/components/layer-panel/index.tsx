import React, { FC, useMemo, useState } from 'react';
import type { SingleLayer } from 'src/types';

type LayerPanelProps = {
  layerConfig: SingleLayer;
};

type NodeConfigBase = {
  parent: string | null;
  next: string | null;
  prev: string | null;
};

type BranchConfig = NodeConfigBase & {
  type: 'branch';
  size: number;
  child: string;
};

type LeafConfig = NodeConfigBase & {
  type: 'leaf';
};

type NodeConfig = LeafConfig | BranchConfig;

function recParse(items: SingleLayer, parent: string | null, map: Map<string, NodeConfig>) {
  items.reduce<string | null>((prev, { id, children }, index, arr) => {
    let nodeConfig: NodeConfig = {
      type: 'leaf',
      parent,
      prev,
      next: arr[index + 1]?.id ?? null,
    };
    if (children?.length) {
      nodeConfig = {
        ...nodeConfig,
        type: 'branch',
        child: children[0].id,
        size: children.length,
      };
      recParse(children, id, map);
    }
    map.set(id, nodeConfig);
    return id;
  }, null);
}

function parseLayerConfig(layerConfig: SingleLayer) {
  const nodeListMap = new Map<string, NodeConfig>();
  recParse(layerConfig, null, nodeListMap);
  return nodeListMap;
}

function currentTreeList(
  expanded: Record<string, string>,
  layerConfig: SingleLayer,
  res: SingleLayer,
) {
  layerConfig.forEach((val) => {
    res.push(val);
    if (expanded[val.id] && val.children?.length) {
      currentTreeList(expanded, val.children, res);
    }
  });
}

function getCurrentList(expanded: Record<string, string>, layerConfig: SingleLayer) {
  const res: SingleLayer = [];
  currentTreeList(expanded, layerConfig, res);
  return res;
}

const itemHeight = 24;
const LayerPanel: FC<LayerPanelProps> = ({ layerConfig }) => {
  const [expanded, setExpanded] = useState<Record<string, string>>({});

  const List = useMemo(() => getCurrentList(expanded, layerConfig), [expanded, layerConfig]);

  return (
    <div style={{ width: 300, height: '100%' }}>
      <div className="inner" style={{ height: 24 * List.length }}></div>
    </div>
  );
};

export default LayerPanel;
