import { processWrites } from 'oro-functions';

import { saveConfigGithubUser } from '@/features/config/config-user.js';
import { apiGetGithubUser } from '@/features/github/api/get-github-user.js';
import { OGH_CONFIG_FILEPATH } from '@/features/global/constants.js';

import type { GithubLoginProps } from './types.js';

export async function fnAction<T>(data: T): Promise<void> {
  // init

  const { token } = data as GithubLoginProps;

  // get user

  const userResponse = await apiGetGithubUser({ token });
  if (!userResponse.status) {
    processWrites([{ s: '\n' }, { c: 'redflat', s: userResponse.error.msg }, { s: '\n' }]);
    return;
  }

  // save data locally

  const { status: _, userid, ...githubUser } = userResponse;

  const saveResponse = await saveConfigGithubUser({ ...githubUser, userid: String(userid), token });
  if (!saveResponse.status) {
    processWrites([{ s: '\n' }, { c: 'redflat', s: saveResponse.error.msg }, { s: '\n' }]);
    return;
  }

  // output

  processWrites([
    { s: `\n` },
    { s: `✔️ Saved!\n` },
    { s: `· filepath: ` },
    { c: 'yellowflat', s: `${OGH_CONFIG_FILEPATH}` },
    { s: `\n\n` },
  ]);
}
