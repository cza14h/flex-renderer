import { createContext } from 'react';
import type { ModuleBasic } from '@app/types';

export type MetaContextType = {
  components: ModuleBasic['components'];
  basics: ModuleBasic['basics'];
  breakpoint: string;
};

export const MetaContext = createContext<MetaContextType>({
  components: {},
  basics: { default: {} },
  breakpoint: 'default',
});
