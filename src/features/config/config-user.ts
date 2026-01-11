import { SResponseKOSimple, SResponseOKBasic, processWrites } from 'oro-functions';

import { GithubUser } from '@/features/github/types.js';
import { getUserToken, saveUserToken } from '@/features/keytar/user-token.js';

import { getConfig, saveConfig } from './config.js';
import { DEFAULT_CONFIG_USER } from './constants.js';
import type { Config } from './types.js';

//

export interface GetConfigUser {
  user: GithubUser;
  token: string;
}

export async function getConfigUser(props: { verbose?: boolean; strict: true }): Promise<GetConfigUser>;
export async function getConfigUser(props?: { verbose?: boolean; strict?: false }): Promise<Partial<GetConfigUser>>;
export async function getConfigUser({
  verbose = true,
  strict = false,
}: { verbose?: boolean; strict?: boolean } = {}): Promise<Partial<GetConfigUser>> {
  const config = await getConfig();

  // get user

  const userid = config?.user?.userid;
  if (!userid) {
    if (verbose) {
      processWrites([
        { s: '\n' },
        { c: 'redflat', s: 'Error: ', a: ['bold'] },
        { c: 'redflat', s: `There is no logged user. You need to "ogh login" first.` },
        { s: '\n\n' },
      ]);
    }

    if (strict) {
      throw new Error('Cannot get config-user');
    }

    return {};
  }

  // get token

  const tokenResponse = await getUserToken();
  if (!tokenResponse.status) {
    if (verbose) {
      processWrites([
        { s: '\n' },
        { c: 'redflat', s: 'Error: ', a: ['bold'] },
        { c: 'redflat', s: `Cannot get token. You need to "ogh login" again.` },
        { s: '\n\n' },
      ]);
    }

    if (strict) {
      throw new Error('Cannot get config-user');
    }

    return { user: config!.user };
  }

  //

  return { user: config!.user, token: tokenResponse.token };
}

//

export interface SaveConfigGithubUserProps extends GithubUser {
  token: string;
}

export async function saveConfigGithubUser({
  token,
  ...githubUser
}: SaveConfigGithubUserProps): Promise<SResponseOKBasic | SResponseKOSimple> {
  const prevConfig = await getConfig();

  const tokenResponse = await saveUserToken(token);
  if (!tokenResponse.status) return tokenResponse;

  const config: Config = { ...prevConfig, user: { ...DEFAULT_CONFIG_USER, ...prevConfig?.user, ...githubUser } };

  return await saveConfig(config);
}
