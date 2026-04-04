import { createContext, useContext, useState } from 'react';

const LoadingContext = createContext(null);

/**
 * LoadingProvider — wrap around routes so any page can signal
 * when its async data fetch starts and finishes.
 * PageTransition subscribes and keeps the Loader visible until
 * the real work is done (not a fixed timer).
 */
export function LoadingProvider({ children }) {
  const [isPageLoading, setIsPageLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isPageLoading, setIsPageLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function usePageLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error('usePageLoading must be used within <LoadingProvider>');
  return ctx;
}
