import React, { Component } from 'react';
import styles from './index.module.scss';
import { preventDefault } from '@app/utils';
import EditorRenderer from './draggable';
import DragContext from './dragContext';
import type { EditorPanelProps } from './types';

class EditorPanel extends Component<EditorPanelProps> {
  dragSort = new DragContext((from: string[], to: string) => this.props.sortLayer(from, to));

  render(): React.ReactNode {
    const { breakPoint } = this.props;
    return (
      <div className={styles['editor-panel']} onDragOver={preventDefault}>
        <div className="dashboard" style={{ width: breakPoint }}>
          <EditorRenderer layers={this.props.layerConfig} dragContext={this.dragSort} chain="" />
        </div>
      </div>
    );
  }
}

export default EditorPanel;
