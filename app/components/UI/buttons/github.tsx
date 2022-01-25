import { GitHubAuthState } from '~/contexts/github';
import { useAuthWithGitHub } from '~/hooks';
import { Button } from './index';

interface GitHubSignInButtonProps {
  primary?: boolean;
}

const GitHubSignInButton: React.FC<GitHubSignInButtonProps> = ({ primary = false }) => {
  const { githubAuthState, signInWithGitHub } = useAuthWithGitHub();
  return (
    <Button
      type="button"
      onClick={signInWithGitHub}
      disabled={githubAuthState === GitHubAuthState.loading}
      primary={primary}
    >
      <img src="/github.svg" alt="GitHub Logo" width="18px" height="18px" />
      {githubAuthState === GitHubAuthState.loading ? 'Signing you in...' : 'Sign in/up with GitHub'}
    </Button>
  );
};

export { GitHubSignInButton };
