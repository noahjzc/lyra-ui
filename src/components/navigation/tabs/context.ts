import { createContext, useContext } from 'react';
import type { TabsContextValue } from './types';

export const TabsContext = createContext<TabsContextValue>({
  size: 'middle',
  variant: 'line',
});

export function useTabsContext() {
  return useContext(TabsContext);
}
