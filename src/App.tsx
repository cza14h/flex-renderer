import React, { useState } from 'react';
import './App.css';
import LayerPanel from './components/layer-panel';
import layerConfig from './mock';
import produce from 'immer';
import type { LayerItem } from './types';

function App() {
  const [layer, setLayer] = useState(layerConfig);

  const sortLayer = (from: string[], to: string) => {
    const moveSelf = from.some((val) => to.startsWith(val));
    if (moveSelf) return;

    const movePayload = from.map((val) => {
      const path = val.split('').map(Number);
      return path.reduce<any>((last, val) => {
        return last[val];
      }, layer);
    });

    const nextLayer = produce(layer, (draft) => {});

    setLayer(nextLayer);
  };

  return (
    <div className="App" style={{ height: '100vh' }}>
      <LayerPanel layerConfig={layer} sortLayer={sortLayer} />
    </div>
  );
}

export default App;
