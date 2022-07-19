import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LayerLeaf, LayerBranch } from './layer-item';
import type { LayerItem, SingleLayer, SupportedType } from '@app/types';
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

export type SortPayload = {
  chain: string;
  index: number;
};

const itemHeight = 24;
const LayerPanel: FC<LayerPanelProps> = ({ layerConfig }) => {
  const outer = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<Record<string, string>>({});
  const [rectHeight, setRectHeight] = useState(0);
  const [offset, setOffset] = useState(0);
  const [dragSort, setDragSort] = useState<SortPayload | null>(null);

  const toggleExpanded = useRef(function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = { ...prev };
      if (prev[id]) delete next[id];
      else next[id] = id;
      return next;
    });
  });

  const reportHover = useCallback(
    (e: React.DragEvent, payload: SortPayload, type: SupportedType) => {
      let { chain, index } = payload;
      const { clientY } = e;
      const { top, height } = (e.currentTarget as HTMLElement).getBoundingClientRect();
      let res = chain.split('');
      // if (type === 'com') {
      //   if (clientY > top + height / 2) {
      //     res[res.length - 1] = `${Number(res[res.length - 1]) + 1}`;
      //   }
      // } else {
      //   if (clientY > top + (3 * height) / 4) {
      //     res.push('0');
      //   } else if (clientY > top + height / 4) {
      //     res.push('0');
      //   }
      // }

      // if (clientY > top + height / 2) {
      //   res[res.length - 1] = `${Number(res[res.length - 1]) + 1}`;
      // }

      setDragSort({ chain: res.join(''), index });
    },
    [],
  );

  const list = useMemo(() => getCurrentList(expanded, layerConfig), [expanded, layerConfig]);
  const visibleList = useMemo(() => {
    const index = Math.floor(offset / itemHeight);
    const length = Math.ceil(rectHeight / itemHeight);
    return list.slice(index, index + length + 1).map((e, i) => {
      const Com = e.type === 'group' ? LayerBranch : LayerLeaf;
      return (
        <Com
          flattenIndex={index + i}
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

  // console.log(dragSort);
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
          {dragSort && <DropIndicator {...dragSort} height={itemHeight} />}
        </>
      </div>
    </div>
  );
};

export default LayerPanel;
