import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LayerLeaf, LayerBranch } from './layer-item';
import { BranchContext } from '@app/context';
import type { LayerItem, SingleLayer } from '@app/types';
import DropIndicator from './indicator';

type LayerPanelProps = {
  layerConfig: SingleLayer;
};

type FlattenList = LayerItem & {
  chain: string;
};

function currentTreeList(
  expanded: Record<string, string>,
  layerConfig: SingleLayer,
  chain: string,
  res: FlattenList[],
) {
  layerConfig.forEach((val, i) => {
    res.push({ ...val, chain: `${chain}${i}` });
    if (expanded[val.id] && val.children?.length) {
      currentTreeList(expanded, val.children, `${chain}${i}`, res);
    }
  });
}

function getCurrentList(expanded: Record<string, string>, layerConfig: SingleLayer) {
  const res: FlattenList[] = [];
  currentTreeList(expanded, layerConfig, '', res);
  return res;
}

const itemHeight = 24;
const LayerPanel: FC<LayerPanelProps> = ({ layerConfig }) => {
  const outer = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<Record<string, string>>({});
  const [rectHeight, setRectHeight] = useState(0);
  const [offset, setOffset] = useState(0);
  const [dragSort, setDragSort] = useState<string | null>(null);

  const toggleExpanded = useRef(function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = { ...prev };
      if (prev[id]) delete next[id];
      else next[id] = id;
      return next;
    });
  });

  const reportHover = useCallback((e: React.DragEvent, chain: string) => {
    const { clientY } = e;
    const { top, height } = (e.currentTarget as HTMLElement).getBoundingClientRect();
    let res = chain;
    if (clientY > top + height / 2) {
    }

    setDragSort(res);
  }, []);

  const list = useMemo(() => getCurrentList(expanded, layerConfig), [expanded, layerConfig]);
  const visibleList = useMemo(() => {
    const index = Math.floor(offset / itemHeight);
    const length = Math.ceil(rectHeight / itemHeight);
    return list.slice(index, index + length + 1).map((e) => {
      const Com = e.type === 'group' ? LayerBranch : LayerLeaf;
      return (
        <Com
          key={e.id}
          expanded={!!expanded[e.id]}
          chain={e.chain}
          id={e.id}
          height={itemHeight}
          setDragSort={setDragSort}
          reportHover={reportHover}
          toggleExpanded={toggleExpanded.current}
        />
      );
    });
  }, [offset, rectHeight, list, expanded, reportHover]);

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

  return (
    <div ref={outer} style={{ width: 300, height: '100%', overflow: 'auto' }} onScroll={onScroll}>
      <div className="inner" style={{ height: list.length * itemHeight }}>
        <>
          <div
            style={{
              transform: `translateY(${Math.floor(offset / itemHeight) * itemHeight}px)`,
            }}
          >
            {visibleList}
          </div>
          {dragSort && <DropIndicator chain={dragSort} height={itemHeight} />}
        </>
      </div>
    </div>
  );
};

export default LayerPanel;
