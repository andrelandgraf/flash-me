import { createContext, useCallback, useEffect, useState } from 'react';
import { useSubmit, useSearchParams, useTransition, useActionData } from 'remix';
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

enum GitHubAuthState {
  idle = 'idle',
  loading = 'loading',
  canceled = 'canceled',
  email_required = 'email_required',
  name_required = 'name_required',
  internal_error = 'internal_error',
  success = 'success',
}

interface GitHubAuthContext {
  signInWithGitHub: () => void;
  githubAuthState: GitHubAuthState;
}

const GitHubAuthContext = createContext<GitHubAuthContext>({
  signInWithGitHub: () => undefined,
  githubAuthState: GitHubAuthState.idle,
});

const GitHubAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const user = useUser();
  const transition = useTransition();
  const submit = useSubmit();
  const actionData = useActionData<GitHubActionData>();
  const { host, githubClientId } = useEnv();
  const [searchParams] = useSearchParams();
  const [githubAuthState, setGitHubAuthState] = useState<GitHubAuthState>(GitHubAuthState.idle);

  useEffect(() => {
    if (user) {
      setGitHubAuthState(GitHubAuthState.success);
    } else {
      setGitHubAuthState(GitHubAuthState.idle);
    }
  }, [user]);

  useEffect(() => {
    if (transition.submission && transition.submission.action === '/auth/github') {
      setGitHubAuthState(GitHubAuthState.loading);
    }
  }, [transition.submission]);

  const signInWithGitHub = useCallback(() => {
    // we need user:email as the public profile might not have an email address
    setGitHubAuthState(GitHubAuthState.loading);
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

  useEffect(() => {
    if (!actionData || actionData.github.status === 200) {
      return;
    }
    if (actionData.github.state === GithubAuthResState.emailRequired) {
      setGitHubAuthState(GitHubAuthState.email_required);
    }
    if (actionData.github.state === GithubAuthResState.nameRequired) {
      setGitHubAuthState(GitHubAuthState.name_required);
    }
    setGitHubAuthState(GitHubAuthState.internal_error);
  }, [actionData]);

  useEffect(() => {
    const githubError = searchParams.get('error');
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const storedState = window.localStorage.getItem(stateKey);

    if (githubError && githubError === 'access_denied') {
      window.localStorage.removeItem(stateKey);
      setGitHubAuthState(GitHubAuthState.canceled);
      return;
    } else if (githubError || storedState !== state) {
      window.localStorage.removeItem(stateKey);
      setGitHubAuthState(GitHubAuthState.internal_error);
      return;
    }

    if (!code || !state || !storedState) {
      return;
    }

    window.localStorage.removeItem(stateKey);

    try {
      const reqData = { code };
      submit(new URLSearchParams(reqData), { method: 'post', action: '/auth/github' });
    } catch (error) {
      console.error(error);
      setGitHubAuthState(GitHubAuthState.internal_error);
    }
  }, [searchParams]);

  return (
    <GitHubAuthContext.Provider value={{ signInWithGitHub, githubAuthState }}>{children}</GitHubAuthContext.Provider>
  );
};

export type { GitHubActionData };

export { GitHubAuthProvider, GitHubAuthContext, GitHubAuthState };
