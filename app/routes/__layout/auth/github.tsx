import { json } from 'remix';
import type { MetaFunction, ActionFunction } from 'remix';
import { getPrivateEnv } from '~/env.server';
import { createUserSession } from '~/session.server';
import { getMetaTags } from '~/utilities';
import { GithubAuthResState } from '~/actions/github';
import { authWithGithub } from '~/actions/github/authWithGithub.server';
import { useAuthWithGitHub } from '~/hooks';
import type { GitHubActionData } from '~/contexts/github';
import { GitHubAuthState } from '~/contexts/github';
import { Section } from '~/components/UI/layout';
import { H1 } from '~/components/UI/headings';
import { GitHubSignInButton } from '~/components/UI/buttons/github';
import { StyledLink } from '~/components/UI/links';

export const meta: MetaFunction = ({ data }) => {
  return getMetaTags({ title: data?.error ? 'Auth Error' : 'Signing in...', noIndex: true });
};

type ActionData = GitHubActionData;

export const action: ActionFunction = async ({ request }): Promise<ActionData | Response> => {
  const formData = await request.formData();
  const code = formData.get('code');
  if (!code || typeof code !== 'string') {
    return json({ status: GithubAuthResState.codeRequired, state: 400 });
  }
  const { githubClientId, githubClientSecret } = getPrivateEnv();
  const [status, state, user] = await authWithGithub(githubClientId, githubClientSecret, code);
  if (status !== 200 || !user) {
    return json({ status, state });
  }
  return createUserSession(request, user, '/');
};

export default function GitHuAuthError() {
  const { githubAuthState } = useAuthWithGitHub();

  if (
    githubAuthState === GitHubAuthState.success ||
    githubAuthState === GitHubAuthState.loading ||
    githubAuthState === GitHubAuthState.idle
  ) {
    return <H1>Loading...</H1>;
  }

  return (
    <>
      <H1>GitHub Auth Error</H1>
      <Section className="justify-center items-center">
        <p>Apologies, something went wrong while signing in/up with GitHub.</p>
        {githubAuthState === GitHubAuthState.canceled && (
          <p>
            It seems like you canceled the sign in/up with GitHub. You can try again by clicking the button below. Or
            just navigate back to the homepage.
          </p>
        )}
        {githubAuthState === GitHubAuthState.email_required && (
          <p>
            We were not able to access your email address. Please check your GitHub settings and make sure you have an
            email address associated with your GitHub account. You can try again by clicking the button below. Or just
            navigate back to the homepage.
          </p>
        )}
        {githubAuthState === GitHubAuthState.internal_error ||
          (githubAuthState === GitHubAuthState.name_required && (
            <p>
              We logged this error and will investigate the root cause. We apologize for the inconvinience. You can try
              again by clicking the button below. Or just navigate back to the homepage.
            </p>
          ))}
      </Section>
      <nav className="w-full inline-flex gap-5 text-center justify-center items-center">
        <span>
          <StyledLink to="/">Back to Homepage</StyledLink>
        </span>
        <span>or</span>
        <span>
          <GitHubSignInButton />
        </span>
      </nav>
    </>
  );
}
