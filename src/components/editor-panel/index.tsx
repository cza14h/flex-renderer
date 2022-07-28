import { LayerConfig } from '@app/types';
import React, { Component, ReactNode } from 'react';
import styles from './index.module.scss';
import { FlexContainer, NormalContainer } from './editorFlex';
import { preventDefault } from '@app/utils';

type EditorPanelProps = {
  breakPoint: number;
  layerConfig: LayerConfig.ItemList;
  sortLayer(from: string[], to: string): void;
};

function render(layer: LayerConfig.ItemList, dragSort: DragSortRW, chain = '') {
  return layer.reduce<ReactNode[]>((last, { type, id, children }, index) => {
    const currentChain = `${chain}${index}`;
    const props = { key: id, id, chain: currentChain, dragSort };
    if (type === 'group') {
      last.push(
        <FlexContainer {...props}>{render(children!, dragSort, currentChain)}</FlexContainer>,
      );
    } else {
      last.push(<NormalContainer {...props} />);
    }
    return last;
  }, []);
}

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
  dragSort = new DragSortRW(this.props.sortLayer);

  render(): React.ReactNode {
    const { breakPoint } = this.props;
    return (
      <div className={styles['editor-panel']} onDragOver={preventDefault}>
        <div className="dashboard" style={{ width: breakPoint }}>
          <>{render(this.props.layerConfig, this.dragSort)}</>
        </div>
      </div>
    );
  }
}

export default EditorPanel;
