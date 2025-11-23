import { processWrites } from 'oro-functions';

import { apiGetGithubUser } from '@/features/github/api/get-github-user.js';

import { getConfigRepos } from './config-repos.js';
import { getConfigUser } from './config-user.js';

//

export async function requirementConfigUser(): Promise<boolean> {
  const { user, token } = await getConfigUser({ verbose: true });

  if (!user || !token) return false;

  // check token

  const userResponse = await apiGetGithubUser({ token });
  if (!userResponse.status) {
    processWrites([
      { s: '\n' },
      { c: 'redflat', s: 'Error: ', a: ['bold'] },
      { c: 'redflat', s: `Token is invalid (${userResponse.error.message}). You need to "ogh login" again.` },
      { s: '\n\n' },
    ]);

    return false;
  }

  return true;
}

//

export async function requirementConfigRepos(): Promise<boolean> {
  const { repos } = await getConfigRepos({ verbose: true });

  return !!repos && repos.length > 0;
}
