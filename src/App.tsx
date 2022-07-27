import React, { useMemo, useState } from 'react';
import './App.css';
import LayerPanel from './components/layer-panel';
import EditorPanel from './components/editor-panel';
import layerConfig, { components, basics } from './mock';
import produce from 'immer';
import type { LayerConfig } from './types';
import { MetaContext } from './context';

function walkAlongPath<T extends { children?: T[] }>(path: number[], tree: T) {
  return path.reduce<T>((last, val) => last.children![val], tree);
}

function recursiveFilter(layerConfig: LayerConfig.ItemList) {
  return layerConfig.reduce<LayerConfig.ItemList>((last, val) => {
    if (val) {
      const nextVal = { ...val };
      if (val.children) {
        nextVal.children = recursiveFilter(nextVal.children!);
      }
      last.push(nextVal);
    }
    return last;
  }, []);
}

function App() {
  const [layer, setLayer] = useState(layerConfig);

  const sortLayer = (from: string[], to: string) => {
    const moveSelf = from.some((val) => to.startsWith(val));
    if (moveSelf) return;

    const fromInSplit = from.map((val) => val.split('').map(Number));
    const toMovePayload = fromInSplit.map((path) =>
      walkAlongPath(path, { id: '', type: 'com', children: layer } as LayerConfig.LayerItem),
    );

    const toInSplit = to.split('').map(Number);
    const lastIndex = toInSplit.slice(-1)[0];
    const insertPath = toInSplit.slice(0, -1);

    const insertChain = insertPath.join('');
    // TODO move inside the layer mutation and iterate the remove index
    const toRemove = fromInSplit.map((val, i) => {
      if (val.length >= to.length && from[i].startsWith(insertChain)) {
        const nextVal = [...val];
        if (nextVal[insertChain.length] >= lastIndex) nextVal[insertChain.length] += from.length;
        return nextVal;
      }
      return val;
    });
    // console.log(...toRemove);

    const nextLayer = produce(layer, (draft) => {
      const pseudoRootLayer: LayerConfig.LayerItem = { id: '', type: 'com', children: draft };
      // insert
      const ref = walkAlongPath(insertPath, pseudoRootLayer);
      ref?.children?.splice(lastIndex, 0, ...toMovePayload);
      // mark to delete
      toRemove.forEach((val) => {
        const removeRef = walkAlongPath(val.slice(0, -1), pseudoRootLayer);
        //@ts-ignore
        removeRef.children?.splice(val.slice(-1)[0], 1, null);
      });
    });
    const filtered = recursiveFilter(nextLayer);
    setLayer(filtered);
  };

  const ctx = useMemo(() => {
    return {
      components,
      basics,
    };
  }, []);

  return (
    <div className="App" style={{ height: '100vh' }}>
      <MetaContext.Provider value={ctx}>
        <LayerPanel layerConfig={layer} sortLayer={sortLayer} />
        <EditorPanel layerConfig={layer} breakPoint={500} />
      </MetaContext.Provider>
    </div>
  );
}

export default App;
