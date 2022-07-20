import React, { Component, ReactNode } from 'react';
import arrow from '@app/assets/arrow.svg';
import style from './layer-item.module.scss';
import type { SupportedType } from '@app/types';
import type { SortPayload, ReportHoverType } from '.';
import { preventDefault } from '@app/utils';

type LayerItemProps = {
  id: string;
  flattenIndex: number;
  chain: string;
  height: number;
  children?: ReactNode;
  expanded: boolean;
  toggleExpanded: (id: string) => void;
  reportHover: ReportHoverType;
  setDragSort: (s: SortPayload | null) => void;
  onNodeDragEnd: (e: React.DragEvent) => void;
};

class DraggableSort extends Component<LayerItemProps> {
  type: SupportedType = 'com';
  reportHover = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const { chain, flattenIndex, expanded } = this.props;
    this.props.reportHover(e, { chain, index: flattenIndex }, expanded, this.type);
  };

  dragStart = (e: React.DragEvent) => {
    const { chain, flattenIndex, id } = this.props;
    e.dataTransfer.setData('layer/dragStart', id);
    e.dataTransfer.dropEffect = 'move';
    e.dataTransfer.effectAllowed = 'move';
    this.props.setDragSort({ chain, index: flattenIndex });
  };

  onNodeDragEnd = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.setDragSort(null);
  };

  render(): React.ReactNode {
    const { chain } = this.props;
    return (
      <div
        className={style['layer-item']}
        style={{
          height: this.props.height,
          paddingLeft: chain.length ? chain.length * 10 + 8 : 0,
        }}
        draggable
        onDragStart={this.dragStart}
        onDragOver={this.reportHover}
        onDragEnd={this.onNodeDragEnd}
        onDrop={preventDefault}
      >
        {this.renderViews()}
      </div>
    );
  }
  renderViews(): ReactNode {
    return null;
  }
}

export class LayerBranch extends DraggableSort {
  type = 'group' as const;
  toggleExpand = () => {
    this.props.toggleExpanded(this.props.id);
  };

  renderViews() {
    const className = this.props.expanded ? 'expanded' : ' collapsed';

    return (
      <>
        <img src={arrow} className={className + ' arrow'} alt="arrow" onClick={this.toggleExpand} />
        {this.props.id}
      </>
    );
  }
}

export class LayerLeaf extends DraggableSort {
  type = 'com' as const;
  renderViews(): React.ReactNode {
    return this.props.id;
  }
}
