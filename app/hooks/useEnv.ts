import invariant from 'tiny-invariant';
import type { PublicEnv } from '~/env.server';
import { useLoaderStore } from './useLoaderStore';

function useEnv() {
  const env = useLoaderStore<PublicEnv>('env');
  invariant(env, 'env must be defined');
  return env;
}

export { useEnv };
