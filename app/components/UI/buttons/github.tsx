import { useAuthWithGitHub } from '~/hooks';
import { Button } from './index';
import { GitHubLogo } from '../icons';

interface GitHubSignInButtonProps {
  primary?: boolean;
}

const GitHubSignInButton: React.FC<GitHubSignInButtonProps> = ({ primary = false }) => {
  const { signInWithGitHub, isLoading } = useAuthWithGitHub();
  return (
    <Button type="button" onClick={signInWithGitHub} disabled={isLoading} primary={primary}>
      <GitHubLogo width="18px" height="18px" />
      {isLoading ? 'Signing you in...' : 'Sign in/up with GitHub'}
    </Button>
  );
};

export { GitHubSignInButton };
