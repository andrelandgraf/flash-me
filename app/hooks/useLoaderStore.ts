import { useMemo } from 'react';
import { useMatches } from 'remix';

function useLoaderStore<T>(key: string): T | undefined {
  const matchingRoute = useMatches();
  const route = useMemo(() => {
    return matchingRoute.find((route) => route.data && route.data[key]);
  }, [matchingRoute, key]);

  if (!route || !route.data || route.data[key] === undefined) {
    return undefined;
  }
  return route.data[key] as T;
}

export { useLoaderStore };
