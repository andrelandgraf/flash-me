import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from 'remix';
import type { HeadersFunction, MetaFunction, LinksFunction, LoaderFunction } from 'remix';
import type { PublicEnv } from './env.server';
import { getPublicEnv } from './env.server';
import { getMetaTags, focusClasses } from './utilities';
import { GitHubAuthProvider } from '~/contexts/github';
import { SkipNavLink } from '@reach/skip-nav';

import skipNavStyles from '@reach/skip-nav/styles.css';
import styles from './styles/tailwind.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
    { rel: 'stylesheet', href: skipNavStyles },
  ];
};

export const headers: HeadersFunction = () => {
  const headers = new Headers();
  headers.set('Cache-Control', 'public, max-age=3600');
  return headers;
};

export const meta: MetaFunction = () => {
  return getMetaTags({ useCatchPhraseInTitle: true });
};

interface LoaderData {
  env: PublicEnv;
}

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
  const env = getPublicEnv();
  return { env };
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <meta property="twitter:site" content="@andrelandgraf94" />
        <meta property="twitter:creator" content="@andrelandgraf94" />
        <meta property="image" content="/logo.png" />
        <meta property="og:image" content="/logo.png" />
        <meta property="twitter:image" content="/logo.png" />
        <meta name="keywords" content="flashcards, flashcard, flashcard-app" />
        <Meta />
        <Links />
      </head>
      <body className="relative w-screen min-h-screen antialiased bg-indigo-200 text-lg text-gray-900 leading-relaxed overflow-x-hidden">
        <SkipNavLink className={focusClasses()} />
        <GitHubAuthProvider>
          <Outlet />
        </GitHubAuthProvider>
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
}
