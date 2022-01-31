import { createContext, useCallback, useMemo, useState, useEffect } from 'react';
import { useActionData, useSearchParams, useSubmit, useTransition } from 'remix';
import { GithubAuthResState } from '~/actions/github';
import { useEnv, useUser } from '~/hooks';

const generateRandomStr = () =>
  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

const stateKey = 'gh_state';

interface GitHubActionData {
  github: {
    status: number;
    state: GithubAuthResState;
  };
}

interface GitHubAuthContext {
  signInWithGitHub: () => void;
  isLoading: boolean;
}

const GitHubAuthContext = createContext<GitHubAuthContext>({
  signInWithGitHub: () => undefined,
  isLoading: false,
});

const GitHubAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const user = useUser();
  const transition = useTransition();
  const { host, githubClientId } = useEnv();

  const isLoading = useMemo(() => {
    if (user) return false;
    return !!transition.submission && transition.submission.action === '/auth/github';
  }, [user]);

  const signInWithGitHub = useCallback(() => {
    // we need user:email as the public profile might not have an email address
    const scope = 'read:user user:email';
    const redirectUri = `${host}/auth/github`;
    const state = generateRandomStr();
    const url = new URL('https://github.com/login/oauth/authorize');
    url.searchParams.append('client_id', githubClientId);
    url.searchParams.append('redirect_uri', redirectUri);
    url.searchParams.append('scope', scope);
    url.searchParams.append('state', state);
    window.localStorage.setItem(stateKey, state);
    window.location.href = url.toString();
  }, [host, githubClientId]);

  return <GitHubAuthContext.Provider value={{ signInWithGitHub, isLoading }}>{children}</GitHubAuthContext.Provider>;
};

enum GitHubAuthErrorState {
  canceled = 'canceled',
  email_required = 'email_required',
  name_required = 'name_required',
  internal_error = 'internal_error',
}

/**
 * This hook is used in the redirect url route of the GitHub auth flow.
 */
function useGithubErrorState() {
  const submit = useSubmit();
  const [searchParams] = useSearchParams();
  const actionData = useActionData<GitHubActionData>();
  const [githubAuthError, setGithubAuthError] = useState<GitHubAuthErrorState>();

  /*
   * Once GitHub redirects to our page, we use the code to submit to our own backend.
   */
  useEffect(() => {
    const githubError = searchParams.get('error');
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const storedState = window.localStorage.getItem(stateKey);

    if (githubError && githubError === 'access_denied') {
      window.localStorage.removeItem(stateKey);
      setGithubAuthError(GitHubAuthErrorState.canceled);
      return;
    } else if (githubError || storedState !== state) {
      window.localStorage.removeItem(stateKey);
      setGithubAuthError(GitHubAuthErrorState.internal_error);
      return;
    }

    if (!code || !state || !storedState) {
      return;
    }

    window.localStorage.removeItem(stateKey);

    try {
      const reqData = { code };
      submit(new URLSearchParams(reqData), { replace: true, method: 'post' });
    } catch (error) {
      console.error(error);
      setGithubAuthError(GitHubAuthErrorState.internal_error);
    }
  }, [searchParams]);

  /*
   * Once our own backend returns a response, we handle it below.
   */
  useEffect(() => {
    if (!actionData) {
      return;
    }
    if (actionData.github.state === GithubAuthResState.emailRequired) {
      setGithubAuthError(GitHubAuthErrorState.email_required);
    }
    if (actionData.github.state === GithubAuthResState.nameRequired) {
      setGithubAuthError(GitHubAuthErrorState.name_required);
    }
    setGithubAuthError(GitHubAuthErrorState.internal_error);
  }, [actionData]);

  return githubAuthError;
}

export type { GitHubActionData };

export { GitHubAuthProvider, GitHubAuthContext, GitHubAuthErrorState, useGithubErrorState };
