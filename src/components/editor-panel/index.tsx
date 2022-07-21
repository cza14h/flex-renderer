import React, { Component } from 'react';

type EditorPanelProps = {
  breakPoint: number;
};

class EditorPanel extends Component<EditorPanelProps> {
  render(): React.ReactNode {
    const { breakPoint } = this.props;
    return (
      <div className="editor-panel" style={{ width: breakPoint }}>
        
      </div>
    );
  }
}

export default EditorPanel;
