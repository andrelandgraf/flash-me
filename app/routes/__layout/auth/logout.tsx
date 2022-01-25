import type { ActionFunction } from 'remix';
import { deleteUserSession } from '~/session.server';

export const action: ActionFunction = async ({ request }) => {
  return deleteUserSession(request, '/');
};
