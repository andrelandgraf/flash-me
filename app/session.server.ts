import type { SessionStorage } from 'remix';
import { createCookieSessionStorage, redirect } from 'remix';
import type { User } from '@prisma/client';
import invariant from 'tiny-invariant';
import { db } from './db.server';
import { getPrivateEnv } from './env.server';

type UserSession = {
  user: User;
};

function isObject(obj: unknown): obj is Record<string, unknown> {
  return !!obj && typeof obj === 'object';
}

function isUser(user: unknown): user is User {
  return isObject(user) && !!user.id && !!user.email && !!user.name;
}

let cookieSessionStorage: SessionStorage | undefined;
function getCookieSessionStorage(): SessionStorage {
  if (cookieSessionStorage) {
    return cookieSessionStorage;
  }
  const { sessionCookie } = getPrivateEnv();
  cookieSessionStorage = createCookieSessionStorage({
    cookie: {
      name: sessionCookie.name,
      isSigned: true,
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      sameSite: 'lax',
      secrets: sessionCookie.secrets,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    },
  });
  return cookieSessionStorage;
}

async function getUserSession(request: Request): Promise<UserSession | undefined> {
  const { getSession, destroySession } = getCookieSessionStorage();
  const session = await getSession(request.headers.get('Cookie'));
  const sessionUser = session.get('user');
  if (!sessionUser) {
    return undefined;
  }
  invariant(isUser(sessionUser), 'session user must be defined');
  const user = await db.user.findUnique({ where: { id: sessionUser.id } });
  if (!user) {
    destroySession(session);
    return undefined;
  }

  return { user };
}

async function requireUserSession<nextLoader>(
  request: Request,
  next: (userSession: UserSession) => Promise<nextLoader | Response>,
) {
  const session = await getUserSession(request);
  if (!session) {
    return redirect('/');
  }
  return next(session);
}

async function createUserSession(request: Request, user: User, redirectPath = '/') {
  const { getSession, commitSession } = getCookieSessionStorage();
  const session = await getSession(request.headers.get('Cookie'));
  session.set('user', user);
  return redirect(redirectPath, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
}

async function deleteUserSession(request: Request, redirectPath = '/') {
  const { getSession, destroySession } = getCookieSessionStorage();
  const session = await getSession(request.headers.get('Cookie'));
  return redirect(redirectPath, {
    headers: {
      'Set-Cookie': await destroySession(session),
    },
  });
}

export { getUserSession, requireUserSession, createUserSession, deleteUserSession };
