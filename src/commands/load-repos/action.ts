import { Ofn, processWrites } from 'oro-functions';

import { saveConfigGithubRepos } from '@/features/config/config-repos.js';
import { getConfigUser } from '@/features/config/config-user.js';
import { apiGetGithubRepos } from '@/features/github/api/get-github-repos.js';
import { OGH_CONFIG_FILEPATH } from '@/features/global/constants.js';

export async function fnAction<T>(_data: T): Promise<void> {
  // init

  const { token } = await getConfigUser({ strict: true });

  // get repos

  const reposResponse = await apiGetGithubRepos(token);

  if (!reposResponse.status) {
    Ofn.processWrite({ c: 'redflat', s: `\n${reposResponse.error.msg}\n` });
    return;
  }

  const { repos } = reposResponse;

  // save data locally

  const saveResponse = await saveConfigGithubRepos(repos);

  if (!saveResponse.status) {
    Ofn.processWrite({ c: 'redflat', s: `\n${saveResponse.error.msg}\n` });
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
