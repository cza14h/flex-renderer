import { SingleLayer } from '@app/types';
import React, { Component, ReactNode } from 'react';
import styles from './index.module.scss';
import { GroupContainer, NormalContainer } from './editorFlex';

type EditorPanelProps = {
  breakPoint: number;
  layerConfig: SingleLayer;
};

function render(layer: SingleLayer) {
  return layer.reduce<ReactNode[]>((last, { type, id, children }) => {
    const props = { key: id, id };
    if (type === 'group') {
      last.push(<GroupContainer>{render(children!)}</GroupContainer>);
    } else {
      last.push(<NormalContainer />);
    }
    return last;
  }, []);
}

class EditorPanel extends Component<EditorPanelProps> {
  render(): React.ReactNode {
    const { breakPoint } = this.props;
    return (
      <div className={styles['editor-panel']}>
        <div className="dashboard" style={{ width: breakPoint }}>
          <>{render(this.props.layerConfig)}</>
        </div>
      </div>
    );
  }
}

export default EditorPanel;
