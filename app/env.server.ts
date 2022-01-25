import dotenv from 'dotenv';
import invariant from 'tiny-invariant';

interface PublicEnv {
  host: string;
  githubClientId: string;
}

interface PrivateEnv extends PublicEnv {
  databaseUrl: string;
  githubClientSecret: string;
  sessionCookie: {
    name: string;
    secrets: string[];
  };
}

const isTrue = (envVar: string | undefined): boolean => envVar === 'true';

const isStrContent = (envVar: string | undefined): envVar is string => typeof envVar === 'string' && !!envVar;

async function loadEnv() {
  dotenv.config({ path: '.env' });
}

function getPublicEnv(): PublicEnv {
  const host = process.env.HOST;
  const githubClientId = process.env.GITHUB_CLIENT_ID;
  invariant(host, 'HOST must be set');
  invariant(githubClientId, 'GITHUB_CLIENT_ID must be set');
  return {
    host,
    githubClientId,
  };
}

function getPrivateEnv(): PrivateEnv {
  const databaseUrl = process.env.DATABASE_URL;
  const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
  invariant(databaseUrl, 'DATABASE_URL must be set');
  invariant(githubClientSecret, 'GITHUB_CLIENT_SECRET must be set');

  // session cookie secrets
  const sessionCookieName = '__session';
  const secret1 = process.env.SESSION_COOKIE_SECRET_1;
  const secret2 = process.env.SESSION_COOKIE_SECRET_2;
  const secret3 = process.env.SESSION_COOKIE_SECRET_3;
  const secret4 = process.env.SESSION_COOKIE_SECRET_4;
  invariant(isStrContent(secret1), `${sessionCookieName} cookie secret1 env variable is missing!`);
  invariant(isStrContent(secret2), `${sessionCookieName} cookie secret1 env variable is missing!`);
  invariant(isStrContent(secret3), `${sessionCookieName} cookie secret1 env variable is missing!`);
  invariant(isStrContent(secret4), `${sessionCookieName} cookie secret1 env variable is missing!`);
  const sessionCookieSecrets: string[] = [secret1, secret2, secret3, secret4];

  return {
    ...getPublicEnv(),
    databaseUrl,
    githubClientSecret,
    sessionCookie: {
      name: sessionCookieName,
      secrets: sessionCookieSecrets,
    },
  };
}

export type { PublicEnv, PrivateEnv };

export { loadEnv, getPublicEnv, getPrivateEnv };
