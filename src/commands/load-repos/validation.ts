import { processWrites } from 'oro-functions';

import { getConfigUser } from '@/features/config/config-user.js';
import { apiGetGithubRepos } from '@/features/github/api/get-github-repos.js';
import { GITHUB_BRANCH_ORDER } from '@/features/github/constants.js';

import type { GithubLoadReposProps } from './types.js';

export async function fnValidation<T>(data: T): Promise<boolean> {
  const { detailed } = data as GithubLoadReposProps;

  // init

  const { token } = await getConfigUser({ strict: true });

  // get repos

  const reposResponse = await apiGetGithubRepos(token, true);
  if (!reposResponse.status) {
    processWrites([{ s: '\n' }, { c: 'redflat', s: reposResponse.error.msg }, { s: '\n' }]);
    return false;
  }

  const { repos } = reposResponse;

  // show

  processWrites([{ s: `\nYou are going to save:\n` }]);

  if (!detailed) {
    processWrites([{ s: `· total repos: ` }, { c: 'greenflat', s: `${repos.length}`, a: ['bold'] }, { s: '\n\n' }]);
    return true;
  }

  //

  for (let index = 0, length = repos.length; index < length; index++) {
    const repo = repos[index];
    const defaultBranches = repo.branches.map(({ name }) => name).filter((b) => GITHUB_BRANCH_ORDER.includes(b));
    const otherBranches = repo.branches.map(({ name }) => name).filter((b) => !GITHUB_BRANCH_ORDER.includes(b));

    processWrites([
      { s: `-------------------------------\n` },
      { s: `· ` },
      { c: 'greenflat', s: `${index + 1} `, a: ['bold'] },
      { s: `${repo.fullname}\n`, a: ['bold'] },
      { s: `  url: ${repo.webUrl}\n` },
      { s: `  labels: ` },
      { s: repo.labels.length > 0 ? `\n    · ${repo.labels.map(({ name }) => name).join(', ')}.\n` : '<none>\n' },
      { s: `  default branch: ` },
      { s: repo.defaultBranch ? `${repo.defaultBranch}.\n` : '<none>\n' },
      { s: `  opened branches: ` },
      {
        s:
          repo.branches.length > 0
            ? `\n    · ${defaultBranches.join(', ')}${
                otherBranches.length > 0 ? ` and ${otherBranches.length} more` : ''
              }\n`
            : '<none>\n',
      },
    ]);
  }

  processWrites([
    { s: `-------------------------------\n\n` },
    { s: `· Total repos: `, a: ['bold'] },
    { c: 'greenflat', s: `${repos.length}\n`, a: ['bold'] },
    { s: '\n' },
  ]);

  //

  return true;
}
