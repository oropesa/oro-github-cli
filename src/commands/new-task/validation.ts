import { processWrites } from 'oro-functions';

import { getConfigGithubReposMap } from '@/features/config/config-repos.js';
import { sanitizeBranchName, sanitizeIssueTitle } from '@/features/github/utils.js';

import { GithubNewTaskProps } from './types.js';

export async function fnValidation<T>(data: T): Promise<boolean> {
  const { repo: repoKey, origin, taskId, type, title } = data as GithubNewTaskProps;

  // check props

  if (!title) {
    processWrites([{ c: 'redflat', s: `\nError: title is required\n` }]);
    return false;
  }

  if (!type) {
    processWrites([{ c: 'redflat', s: `\nError: type is required\n` }]);
    return false;
  }

  // check repo

  const githubRepos = await getConfigGithubReposMap();

  const repo = githubRepos.get(repoKey);
  if (!repo) {
    processWrites([{ c: 'redflat', s: `\nError: repo '${repoKey}' not exist\n` }]);
    return false;
  }

  // init

  const issueTitle = sanitizeIssueTitle({ type, title, taskId });
  const branchName = sanitizeBranchName({ type, title, taskId });

  //

  processWrites([
    { s: `\nYou are going to create:\n` },
    { s: `· in repo: ` },
    { c: 'red', s: `${repo.fullname}\n` },
    { s: `· from origin: ` },
    { c: 'purpleflat', s: `${origin}\n` },
    { s: `· a new issue: ` },
    { c: 'green', s: `${issueTitle}\n` },
    { s: `· a new branch: ` },
    { c: 'yellowflat', s: `${branchName}\n` },
  ]);

  return true;
}
