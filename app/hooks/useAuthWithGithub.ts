import { useContext } from 'react';
import { GitHubAuthContext } from '~/contexts/github';

function useAuthWithGitHub() {
  return useContext(GitHubAuthContext);
}

export { useAuthWithGitHub };
