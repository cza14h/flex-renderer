import { createContext } from 'react';

type BranchContextType = {
  expanded: Record<string, string>;
  toggleExpand: (id: string) => void;
};

export const BranchContext = createContext<BranchContextType>({
  expanded: {},
  toggleExpand() {},
});
