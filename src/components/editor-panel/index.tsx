import { LayerConfig } from '@app/types';
import React, { Component, ReactNode } from 'react';
import styles from './index.module.scss';
import { FlexContainer, NormalContainer } from './editorFlex';
import { preventDefault } from '@app/utils';

type EditorPanelProps = {
  breakPoint: number;
  layerConfig: LayerConfig.ItemList;
};

function render(layer: LayerConfig.ItemList, chain = '') {
  return layer.reduce<ReactNode[]>((last, { type, id, children }, index) => {
    const currentChain = `${chain}${index}`;
    const props = { key: id, id, chain: currentChain };
    if (type === 'group') {
      last.push(<FlexContainer {...props}>{render(children!, currentChain)}</FlexContainer>);
    } else {
      last.push(<NormalContainer {...props} />);
    }
    return last;
  }, []);
}

class EditorPanel extends Component<EditorPanelProps> {
  render(): React.ReactNode {
    const { breakPoint } = this.props;
    return (
      <div className={styles['editor-panel']} onDragOver={preventDefault}>
        <div className="dashboard" style={{ width: breakPoint }}>
          <>{render(this.props.layerConfig)}</>
        </div>
      </div>
    );
  }
}

export default EditorPanel;
