import React, { useCallback, useMemo, useState } from 'react';
import './App.css';
import LayerPanel from './components/layer-panel';
import EditorPanel from './components/editor-panel';
import layerConfig, { components, basics } from './mock';
import { MetaContext } from './context';
import { sortImmutableLayer } from './utils/sortLayer';

function App() {
  const [layer, setLayer] = useState(layerConfig);

  const sortLayer = useCallback(
    (from: string[], to: string) => {
      const filtered = sortImmutableLayer(layer, from, to);
      if (filtered === null) return;
      setLayer(filtered);
    },
    [layer],
  );

  const ctx = useMemo(() => {
    return {
      components,
      basics,
      breakpoint: 'default',
    };
  }, []);

  return (
    <div className="App" style={{ height: '100vh' }}>
      <MetaContext.Provider value={ctx}>
        <LayerPanel layerConfig={layer} sortLayer={sortLayer} />
        <EditorPanel layerConfig={layer} breakPoint={500} sortLayer={sortLayer} />
      </MetaContext.Provider>
    </div>
  );
}

export default App;
