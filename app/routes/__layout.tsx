import type { LoaderFunction } from 'remix';
import { useTransition } from 'remix';
import { Form, Outlet } from 'remix';
import type { User } from '@prisma/client';
import { SkipNavContent } from '@reach/skip-nav';
import { getUserSession } from '~/session.server';
import { useAuthWithGitHub, useUser } from '~/hooks';
import { Main } from '~/components/UI/layout';
import { LogoWithLink } from '~/components/UI/icons';
import { Button } from '~/components/UI/buttons';
import { GitHubSignInButton } from '~/components/UI/buttons/github';
import StyledLink from '~/components/UI/links';
import { GitHubLogo } from '~/components/UI/icons';

interface LoaderData {
  user?: User;
}

export const loader: LoaderFunction = async ({ request }): Promise<LoaderData> => {
  const session = await getUserSession(request);
  return { user: session?.user };
};

export default function BaseLayout() {
  const { isLoading } = useAuthWithGitHub();
  const { user } = useUser();
  const transition = useTransition();
  return (
    <div className="w-full min-h-screen flex flex-col">
      <header className="w-full">
        <nav className="w-full pt-5 px-5 flex mobile:flex-col justify-center items-center gap-5">
          <LogoWithLink className="w-full max-w-sm xl:max-w-md mr-auto" />
          {!user && !isLoading && <GitHubSignInButton />}
        </nav>
      </header>
      <Main className="mb-auto">
        <SkipNavContent />
        <Outlet />
      </Main>
      <footer className="relative mt-40 pb-5 px-5 text-sm w-full flex flex-col-reverse justify-center text-center items-center gap-5 lg:flex-row lg:gap-0">
        <p className="lg:absolute left-2 leading-loose">
          <small>
            <time>{new Date().getFullYear()}</time> © Andre Landgraf
          </small>
        </p>
        <p>
          Developed with 💜 by <StyledLink to="https://twitter.com/AndreLandgraf94">Andre Landgraf</StyledLink>. Code
          can be found on&nbsp;
          <StyledLink
            to="https://github.com/andrelandgraf/flash-me"
            className="inline-flex items-center justify-center gap-2"
          >
            Github <GitHubLogo width="15px" height="15px" />
          </StyledLink>
          .
        </p>
        {user && (
          <Form method="post" action="/auth/logout" className="lg:absolute right-2">
            <Button type="submit" disabled={!!transition.submission}>
              {transition.submission?.action === '/auth/logout' ? 'Logging out...' : 'Logout'}
            </Button>
          </Form>
        )}
      </footer>
    </div>
  );
}
