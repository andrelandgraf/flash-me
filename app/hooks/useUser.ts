import type { User } from '@prisma/client';
import { useLoaderStore } from './useLoaderStore';

function useUser() {
  const user = useLoaderStore<User>('user');
  return { user };
}

export { useUser };
