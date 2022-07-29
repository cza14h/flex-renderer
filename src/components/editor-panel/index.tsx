import { LayerConfig } from '@app/types';
import React, { Component } from 'react';
import styles from './index.module.scss';
import { preventDefault } from '@app/utils';
import EditorRenderer from './draggable';

type EditorPanelProps = {
  breakPoint: number;
  layerConfig: LayerConfig.ItemList;
  sortLayer(from: string[], to: string): void;
};

type MemberIdentifier = {
  chain: string;
  id: string;
};

export class DragSortRW {
  constructor(public sortLayer: EditorPanelProps['sortLayer']) {}
  private initiator: MemberIdentifier | null = null;
  private target: MemberIdentifier | null = null;

  reset = () => {
    this.initiator = this.target = null;
  };
  getInitiator = () => this.initiator;
  setInitiator = (initiator: MemberIdentifier) => {
    this.initiator = initiator;
  };
  getTarget = () => this.target;
  setTarget = (target: MemberIdentifier) => {
    this.target = target;
  };
}

class EditorPanel extends Component<EditorPanelProps> {
  dragSort = new DragSortRW((from: string[], to: string) => this.props.sortLayer(from, to));

  render(): React.ReactNode {
    const { breakPoint } = this.props;
    return (
      <div className={styles['editor-panel']} onDragOver={preventDefault}>
        <div className="dashboard" style={{ width: breakPoint }}>
          <EditorRenderer layers={this.props.layerConfig} dragSort={this.dragSort} />
        </div>
      </div>
    );
  }
}

export default EditorPanel;
