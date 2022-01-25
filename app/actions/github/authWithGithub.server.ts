import type { User } from '@prisma/client';
import type { ActionResult } from '../types';
import { getGitHubAuthToken, GithubAuthTokenResState } from './getAuthToken.server';
import { db } from '../../db.server';
import { GithubAuthResState } from './index';

type GithubUserResBody = {
  id: number;
  node_id: string;
  avatar_url: string;
  url: string;
  html_url: string;
  type: 'User';
  name: string;
  company: string;
  blog: string;
  location: string;
  email: string | null; // returns only the public visible email, can be null even if user:email in scope
  twitter_username: string;
};

type GithubUserEmailsResBody = [
  {
    email: string;
    primary: boolean;
    verified: boolean;
  },
];

function formatEmail(email: string) {
  return email.trim().toLowerCase();
}

/**
 * Both register and login with GitHub
 * On success, returns new user
 * It's the responsibility of the caller to create a cookie
 */
async function authWithGithub(
  clientId: string,
  clientSecret: string,
  code?: string,
): Promise<ActionResult<GithubAuthResState, User>> {
  console.info('login called');
  try {
    if (!code) {
      console.error('Code required for github login action');
      return [400, GithubAuthResState.codeRequired, undefined];
    }

    const [tokenStatus, tokenState, headersWithAuth] = await getGitHubAuthToken(clientId, clientSecret, true, code);
    if (tokenStatus !== 200) {
      switch (tokenState) {
        case GithubAuthTokenResState.codeRequired:
          console.error('Code required for github login action');
          return [tokenStatus, GithubAuthResState.codeRequired, undefined];
        case GithubAuthTokenResState.verifyError:
          console.error('GitHub verify error');
          return [tokenStatus, GithubAuthResState.verifyError, undefined];
        default:
          console.error('GitHub internal error');
          return [tokenStatus, GithubAuthResState.internalError, undefined];
      }
    }

    const userResponse = await fetch('https://api.github.com/user', {
      headers: headersWithAuth,
    });

    if (userResponse.status !== 200) {
      console.error(`request to github user endpoint failed with ${userResponse.status}`);
      return [500, GithubAuthResState.verifyError, undefined];
    }

    const userBody: GithubUserResBody = await userResponse.json();
    if (!userBody) {
      console.error(`user empty after user endpoint request`);
      return [500, GithubAuthResState.verifyError, undefined];
    }

    let unformattedEmail: string | null = userBody.email;
    // manage public profile email is empty
    if (!unformattedEmail) {
      // https://stackoverflow.com/questions/35373995/github-user-email-is-null-despite-useremail-scope
      const userEmailResponse = await fetch('https://api.github.com/user/emails', {
        headers: headersWithAuth,
      });

      if (userEmailResponse.status !== 200) {
        console.error(`request to github user emails endpoint failed with ${userEmailResponse.status}`);
        return [500, GithubAuthResState.verifyError, undefined];
      }

      const emails: GithubUserEmailsResBody = await userEmailResponse.json();
      if (!emails) {
        console.error(`user emails array empty after user endpoint request`);
        return [401, GithubAuthResState.emailRequired, undefined];
      }

      unformattedEmail = emails.find((email) => email.primary && email.verified)?.email || null;
      if (!unformattedEmail) {
        console.error('no primary verified email found in github user emails request', emails);
        return [401, GithubAuthResState.emailRequired, undefined];
      }
    }

    const email = formatEmail(unformattedEmail);
    let user = await db.user.findFirst({ where: { email } });

    // manage signup: no githubId or email found in our system
    let isSignUp = false;
    if (!user) {
      isSignUp = true;
      let { name } = userBody;
      if (!name) {
        name = email.split('@')[0];
      }

      if (!name) {
        console.error('name required for register action', userBody);
        return [400, GithubAuthResState.nameRequired, undefined];
      }

      user = await db.user.create({
        data: { email, name },
      });
    }

    if (!user) {
      return [500, GithubAuthResState.internalError, undefined];
    }

    return [200, isSignUp ? GithubAuthResState.signUpSuccess : GithubAuthResState.signInSuccess, user];
  } catch (error) {
    console.error(error);
    return [500, GithubAuthResState.internalError, undefined];
  }
}

export { GithubAuthResState, authWithGithub };
