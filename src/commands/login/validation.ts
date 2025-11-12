import { processWrites } from 'oro-functions';

import { apiGetGithubUser } from '@/features/github/api/get-github-user.js';
import { OGH_CONFIG_FILE } from '@/features/global/constants.js';

import { GithubLoginProps } from './types.js';

export async function fnValidation<T>(data: T): Promise<boolean> {
  const { token } = data as GithubLoginProps;

  // init

  if (!token) {
    processWrites([
      { c: 'redflat', s: `\nError: `, a: ['bold'] },
      { c: 'redflat', s: `token is required.\n\n` },
    ]);
    return false;
  }

  // get user

  const userResponse = await apiGetGithubUser(token);
  if (!userResponse.status) {
    processWrites([{ s: '\n' }, { c: 'redflat', s: userResponse.error.msg }, { s: '\n\n' }]);
    return false;
  }

  //

  const { userid, username, name, email } = userResponse;

  processWrites([
    { s: `\n· ` },
    { s: `Github token`, a: ['italic', 'bold'] },
    { s: ` will be stored in system's keychain.` },
    { s: `\n· ` },
    { s: `Github user`, a: ['italic', 'bold'] },
    { s: ` will be stored in ` },
    { c: 'yellowflat', s: `${OGH_CONFIG_FILE}` },
    { s: `\n  · id: ` },
    { c: 'redflat', s: `${userid}` },
    { s: `\n  · name: ` },
    { c: 'blueflat', s: `${name} (${username})` },
    { s: `\n  · email: ` },
    { c: 'greenflat', s: `${email}` },
    { s: `\n\n` },
  ]);

  return true;
}
