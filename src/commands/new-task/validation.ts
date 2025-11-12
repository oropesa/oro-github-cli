import { capitalize, processWrites, sanitizeFilename, slugify } from 'oro-functions';

import { getConfigGithubReposMap } from '@/features/config/config-repos.js';

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

  const sanitizeTaskId = slugify(sanitizeFilename(taskId.replace(/[/\\]/g, '-')).toLowerCase())
    .replace(/^-+/, '')
    .replace(/-+$/, '')
    .toUpperCase();

  const issueTitle = `${sanitizeTaskId ? `[${sanitizeTaskId}] ` : ''}${capitalize(type)}. ${title}`;
  const branch = `${type}/${sanitizeTaskId ? `${sanitizeTaskId}--` : ''}{issueID}-${slugify(sanitizeFilename(title.replace(/[/\\]/g, '-')).toLowerCase())}`;
  const mergeRequest = `Draft: Resolve "${issueTitle}"`;

  //

  processWrites([
    { s: `\nYou are going to create:\n` },
    { s: `· in repo: ` },
    { c: 'red', s: `${repo.fullname}\n` },
    { s: `· a new issue: ` },
    { c: 'green', s: `${issueTitle}\n` },
    { s: `· a new branch: ` },
    { c: 'yellowflat', s: `${branch}\n` },
    { s: `· from origin: ` },
    { c: 'purpleflat', s: `${origin}\n` },
    { s: `· a merge request: ` },
    { c: 'blue', s: `${mergeRequest}\n` },
  ]);

  return true;
}
