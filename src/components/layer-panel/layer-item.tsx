import React, { Component, ReactNode } from 'react';
import arrow from '@app/assets/arrow.svg';
import style from './layer-item.module.scss';

type LayerItemProps = {
  id: string;
  chain: string;
  height: number;
  children?: ReactNode;
  expanded: boolean;
  toggleExpanded: (id: string) => void;
  reportHover(e: React.DragEvent, chain: string): void;
  setDragSort: React.Dispatch<React.SetStateAction<string | null>>;
};

class DraggableSort extends Component<LayerItemProps> {
  reportHover = (e: React.DragEvent) => {
    this.props.reportHover(e, this.props.chain);
  };

  dragStart = (e: React.DragEvent) => {
    this.props.setDragSort(this.props.id);
  };

  onNodeDragEnd = () => {
    this.props.setDragSort(null);
  };

  onNodeDrop = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  render(): React.ReactNode {
    const { chain } = this.props;
    return (
      <div
        className={style['layer-item']}
        style={{
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
  renderViews(): React.ReactNode {
    return this.props.id;
  }
}
