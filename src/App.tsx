import React from 'react';
import './App.css';
import LayerPanel from './components/layer-panel';
import layerConfig from './mock';

function App() {
  return (
    <div className="App" style={{ height: '100vh' }}>
      <LayerPanel layerConfig={layerConfig} />
    </div>
  );
}

export default App;
