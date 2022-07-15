import React from 'react';
import './App.css';
import LayerPanel from './components/layer-panel';

function App() {
  return (
    <div className="App" style={{ height: '100vh' }}>
      <LayerPanel layerConfig={[]} />
    </div>
  );
}

export default App;
