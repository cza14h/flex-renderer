import React, { Component, createRef } from 'react';
import { LayerLeaf, LayerBranch } from './layer-item';
import type { LayerItem, SingleLayer, SupportedType } from '@app/types';
import DropIndicator from './indicator';
import debounce from 'lodash.debounce';
import { createMemo, preventDefault } from '@app/utils';

type LayerPanelProps = {
  layerConfig: SingleLayer;
  sortLayer(from: string[], to: string): void;
};

type LayerPanelState = {
  rectHeight: number;
  expanded: Record<string, string>;
  scrollTop: number;
  dragSort: SortPayload | null;
};

type LayerMap = Map<
  string,
  LayerItem & {
    chain: string;
  }
>;

export type ReportHoverType = (
  e: React.DragEvent,
  chain: SortPayload,
  expanded: boolean,
  type: SupportedType,
) => void;

function currentTreeList(
  expanded: Record<string, string>,
  layerConfig: SingleLayer,
  chain: string,
  res: LayerMap,
) {
  layerConfig.forEach((val, i) => {
    res.set(val.id, { ...val, chain: `${chain}${i}` });
    if (expanded[val.id] && val.children?.length) {
      currentTreeList(expanded, val.children, `${chain}${i}`, res);
    }
  });
}

function getCurrentList(expanded: Record<string, string>, layerConfig: SingleLayer) {
  const res: LayerMap = new Map();
  currentTreeList(expanded, layerConfig, '', res);
  return res;
}

export type SortPayload = {
  chain: string;
  index: number;
};

const itemHeight = 24;

class LayerPanel extends Component<LayerPanelProps, LayerPanelState> {
  ref = createRef<HTMLDivElement>();
  state: LayerPanelState = {
    rectHeight: 0,
    expanded: {},
    scrollTop: 0,
    dragSort: null,
  };

  onScroll = (e: React.UIEvent) => {
    this.setState({ scrollTop: e.currentTarget.scrollTop });
  };

  toggleExpand = (id: string) => {
    const { expanded } = this.state;
    const next = { ...expanded };
    if (next[id]) delete next[id];
    else next[id] = id;
    this.setState({ expanded: next });
  };

  setDragSort = (s: SortPayload | null) => {
    this.setState({ dragSort: s });
  };

  reportHover: ReportHoverType = (e, payload, expanded, type) => {
    const { clientY, currentTarget } = e;
    if (!currentTarget) return;
    const { top, height } = currentTarget.getBoundingClientRect();
    let { chain, index } = payload;
    let res = chain.split('');
    if (type === 'com') {
      if (clientY > top + height / 2) {
        res[res.length - 1] = `${Number(res[res.length - 1]) + 1}`;
        index++;
      }
    } else {
      if (expanded) {
        if (clientY > top + height / 2) {
          res.push('0');
          index++;
        }
      } else {
        if (clientY > top + (3 * height) / 4) {
          res[res.length - 1] = `${Number(res[res.length - 1]) + 1}`;
          index++;
        } else if (clientY > top + height / 2) {
          res.push('0');
          index++;
        }
      }
    }
    const newChain = res.join('');
    if (this.state.dragSort?.chain === newChain && this.state.dragSort.index === index) return;
    this.setState({ dragSort: { chain: newChain, index } });
  };

  resort = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    const { dragSort } = this.state;
    if (!dragSort) return;
    //TODO batch move consider by id
    const list = this.getCurrentList(this.state.expanded, this.props.layerConfig);
    const emitter = list.get(id)!.chain;
    this.props.sortLayer([emitter], dragSort.chain);
    this.setDragSort(null);
  };

  getCurrentList = createMemo(getCurrentList);

  getVisibleList = createMemo(
    (scrollTop: number, rectHeight: number, expanded: Record<string, string>, map: LayerMap) => {
      const list = Array.from(map.values());
      const index = Math.floor(scrollTop / itemHeight);
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
            setDragSort={this.setDragSort}
            reportHover={this.reportHover}
            toggleExpanded={this.toggleExpand}
            onNodeDragEnd={this.resort}
          />
        );
      });
    },
  );

  observer?: ResizeObserver;
  componentDidMount() {
    this.observer = new ResizeObserver(
      debounce((entries) => {
        const { height } = entries[0].contentRect;
        this.setState({ rectHeight: height });
      }, 200),
    );
    this.observer.observe(this.ref.current!);
  }
  componentWillUnmount() {
    this.observer?.disconnect();
  }

  render() {
    const { scrollTop, dragSort, expanded, rectHeight } = this.state;
    const list = this.getCurrentList(expanded, this.props.layerConfig);
    const visibleList = this.getVisibleList(scrollTop, rectHeight, expanded, list);
    return (
      <div
        ref={this.ref}
        className="layer-panel"
        style={{ width: 300, height: '100%', overflow: 'auto' }}
        onScroll={this.onScroll}
        onDragOver={preventDefault}
      >
        <div className="inner" style={{ height: list.size * itemHeight }}>
          <>
            <div
              style={{
                transform: `translateY(${Math.floor(scrollTop / itemHeight) * itemHeight}px)`,
              }}
            >
              {visibleList}
            </div>
            {dragSort && <DropIndicator {...dragSort} height={itemHeight} />}
          </>
        </div>
      </div>
    );
  }
}

export default LayerPanel;
