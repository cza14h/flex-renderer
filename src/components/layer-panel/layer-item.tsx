import React, { Component, ReactNode } from 'react';
import arrow from '@app/assets/arrow.svg';
import style from './layer-item.module.scss';
import { SupportedType } from 'src/types';
import type { SortPayload } from '.';

type LayerItemProps = {
  id: string;
  flattenIndex: number;
  chain: string;
  height: number;
  children?: ReactNode;
  expanded: boolean;
  toggleExpanded: (id: string) => void;
  reportHover(e: React.DragEvent, chain: SortPayload, type: SupportedType): void;
  setDragSort: React.Dispatch<React.SetStateAction<SortPayload | null>>;
};

class DraggableSort extends Component<LayerItemProps> {
  reportHover = (e: React.DragEvent) => {
    // this.props.reportHover(e, this.props.chain);
  };

  dragStart = (e: React.DragEvent) => {
    const { chain, flattenIndex } = this.props;
    this.props.setDragSort({ chain, index: flattenIndex });
  };

  onNodeDragEnd = () => {
    this.props.setDragSort(null);
  };

  onNodeDrop = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
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
        onDrop={this.onNodeDrop}
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
  toggleExpand = () => {
    this.props.toggleExpanded(this.props.id);
  };

  reportHover = (e: React.DragEvent) => {
    const { chain, flattenIndex } = this.props;
    this.props.reportHover(e, { chain, index: flattenIndex }, 'group');
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
  reportHover = (e: React.DragEvent) => {
    const { chain, flattenIndex } = this.props;
    this.props.reportHover(e, { chain, index: flattenIndex }, 'com');
  };
  renderViews(): React.ReactNode {
    return this.props.id;
  }
}
