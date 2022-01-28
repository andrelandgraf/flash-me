import type { LoaderFunction } from 'remix';
import { useTransition } from 'remix';
import { Form, Outlet } from 'remix';
import type { User } from '@prisma/client';
import { SkipNavContent } from '@reach/skip-nav';
import { getUserSession } from '~/session.server';
import { GitHubAuthState } from '~/contexts/github';
import { useAuthWithGitHub, useUser } from '~/hooks';
import { Main } from '~/components/UI/layout';
import { LogoWithLink } from '~/components/UI/icons';
import { Button } from '~/components/UI/buttons';
import { GitHubSignInButton } from '~/components/UI/buttons/github';
import StyledLink from '~/components/UI/links';

interface LoaderData {
  user?: User;
}

export const loader: LoaderFunction = async ({ request }): Promise<LoaderData> => {
  const session = await getUserSession(request);
  return { user: session?.user };
};

export default function BaseLayout() {
  const { githubAuthState } = useAuthWithGitHub();
  const { user } = useUser();
  const transition = useTransition();
  return (
    <div className="w-full min-h-screen flex flex-col">
      <header className="w-full">
        <nav className="w-full pt-5 px-5 flex mobile:flex-col justify-center items-center gap-5">
          <LogoWithLink className="w-full max-w-sm xl:max-w-md mr-auto" />
          {!user && githubAuthState !== GitHubAuthState.loading && <GitHubSignInButton />}
        </nav>
      </header>
      <Main className="mb-auto">
        <SkipNavContent />
        <Outlet />
      </Main>
      <footer className="mt-40 pb-5 px-5 text-sm flex flex-col justify-center text-center items-center gap-5">
        <p>
          Developed with 💜 by <StyledLink to="https://twitter.com/AndreLandgraf94">Andre Landgraf</StyledLink>
        </p>
        {user && (
          <Form method="post" action="/auth/logout">
            <Button type="submit" disabled={!!transition.submission}>
              {transition.submission?.action === '/auth/logout' ? 'Logging out...' : 'Logout'}
            </Button>
          </Form>
        )}
        <p>{new Date().getFullYear()} © Andre Landgraf</p>
      </footer>
    </div>
  );
}
