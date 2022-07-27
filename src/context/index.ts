import { createContext } from 'react';
import { ModuleBasic } from '@app/types';

export type MetaContextType = {
  components: ModuleBasic['components'];
  basics: ModuleBasic['basics'];
};

export const MetaContext = createContext<MetaContextType>({
  components: {},
  basics: { default: {} },
});
