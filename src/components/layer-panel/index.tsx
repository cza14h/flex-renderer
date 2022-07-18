import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { LayerLeaf, LayerBranch } from './layer-item';
import { BranchContext } from '@app/context';
import type { LayerItem, SingleLayer } from '@app/types';

type LayerPanelProps = {
  layerConfig: SingleLayer;
};

type FlattenList = LayerItem & {
  indent: number;
};

function currentTreeList(
  expanded: Record<string, string>,
  layerConfig: SingleLayer,
  indent: number,
  res: FlattenList[],
) {
  layerConfig.forEach((val) => {
    res.push({ ...val, indent });
    if (expanded[val.id] && val.children?.length) {
      currentTreeList(expanded, val.children, indent + 1, res);
    }
  });
}

function getCurrentList(expanded: Record<string, string>, layerConfig: SingleLayer) {
  const res: FlattenList[] = [];
  currentTreeList(expanded, layerConfig, 0, res);
  return res;
}

const itemHeight = 24;
const LayerPanel: FC<LayerPanelProps> = ({ layerConfig }) => {
  const outer = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<Record<string, string>>({});
  const [rectHeight, setRectHeight] = useState(0);
  const [offset, setOffset] = useState(0);
  const list = useMemo(() => getCurrentList(expanded, layerConfig), [expanded, layerConfig]);
  const visibleList = useMemo(() => {
    const index = Math.floor(offset / itemHeight);
    const length = Math.ceil(rectHeight / itemHeight);
    return list.slice(index, index + length + 1).map((e) => {
      const Com = e.type === 'group' ? LayerBranch : LayerLeaf;
      return <Com key={e.id} indent={e.indent} name={e.id} height={itemHeight} />;
    });
  }, [offset, rectHeight, list]);

  const onScroll = (e: React.UIEvent) => {
    setOffset(e.currentTarget.scrollTop);
  };

  useEffect(() => {
    //debounce
    const observer = new ResizeObserver((entries) => {
      const { height } = entries[0].contentRect;
      setRectHeight(height);
    });
    observer.observe(outer.current!);
    return () => observer.disconnect();
  }, []);

  const ctx = useMemo(() => {
    return {
      expanded,
      toggleExpand(id: string) {
        setExpanded((prev) => {
          const next = { ...prev };
          if (prev[id]) delete next[id];
          else next[id] = id;
          return next;
        });
      },
    };
  }, [expanded]);

  return (
    <div ref={outer} style={{ width: 300, height: '100%', overflow: 'auto' }} onScroll={onScroll}>
      <div className="inner" style={{ height: list.length * itemHeight }}>
        <BranchContext.Provider value={ctx}>
          <div
            style={{
              transform: `translateY(${Math.floor(offset / itemHeight) * itemHeight}px)`,
            }}
          >
            {visibleList}
          </div>
        </BranchContext.Provider>
      </div>
    </div>
  );
};

export default LayerPanel;
