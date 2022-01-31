import type { MetaFunction, ActionFunction } from 'remix';
import { json } from 'remix';
import { getPrivateEnv } from '~/env.server';
import { createUserSession } from '~/session.server';
import { getMetaTags } from '~/utilities';
import { GithubAuthResState } from '~/actions/github';
import { authWithGithub } from '~/actions/github/authWithGithub.server';
import type { GitHubActionData } from '~/contexts/github';
import { useGithubErrorState, GitHubAuthErrorState } from '~/contexts/github';
import { Section } from '~/components/UI/layout';
import { H1 } from '~/components/UI/headings';
import { GitHubSignInButton } from '~/components/UI/buttons/github';
import { StyledLink } from '~/components/UI/links';
import { useAuthWithGitHub } from '~/hooks';

export const meta: MetaFunction = ({ data }) => {
  return getMetaTags({ title: data?.error ? 'Auth Error' : 'Signing in...', noIndex: true });
};

type ActionData = GitHubActionData;

export const action: ActionFunction = async ({ request }): Promise<ActionData | Response> => {
  console.debug('/auth/github action called...');
  const formData = await request.formData();
  const code = formData.get('code');
  if (!code || typeof code !== 'string') {
    return json({ status: GithubAuthResState.codeRequired, state: 400 });
  }
  const { githubClientId, githubClientSecret } = getPrivateEnv();
  const [status, state, user] = await authWithGithub(githubClientId, githubClientSecret, code);
  if (status !== 200 || !user) {
    console.error('Error authenticating with GitHub:', status, state, user);
    return json({ status, state });
  }
  console.debug('/auth/github action success, redirecting to /!');
  return createUserSession(request, user, '/');
};

export default function GitHubAuth() {
  const { isLoading } = useAuthWithGitHub();
  const errorState = useGithubErrorState();

  if (!errorState || isLoading) {
    return (
      <Section className="justify-center items-center">
        <H1>Signing in...</H1>
        <p>This shouldn&#39;t take long!</p>
      </Section>
    );
  }

  return (
    <Section className="justify-center items-center">
      <H1>GitHub Auth Error</H1>
      <p>Apologies, something went wrong while signing in/up with GitHub.</p>
      {errorState === GitHubAuthErrorState.canceled && (
        <p>
          It seems like you canceled the sign in/up with GitHub. You can try again by clicking the button below. Or just
          navigate back to the homepage.
        </p>
      )}
      {errorState === GitHubAuthErrorState.email_required && (
        <p>
          We were not able to access your email address. Please check your GitHub settings and make sure you have an
          email address associated with your GitHub account. You can try again by clicking the button below. Or just
          navigate back to the homepage.
        </p>
      )}
      {errorState === GitHubAuthErrorState.internal_error ||
        (errorState === GitHubAuthErrorState.name_required && (
          <p>
            We logged this error and will investigate the root cause. We apologize for the inconvinience. You can try
            again by clicking the button below. Or just navigate back to the homepage.
          </p>
        ))}
      <nav className="w-full inline-flex gap-5 text-center justify-center items-center">
        <span>
          <StyledLink to="/">Back to Homepage</StyledLink>
        </span>
        <span>or</span>
        <span>
          <GitHubSignInButton />
        </span>
      </nav>
    </Section>
  );
}
