import axios from 'axios';
import { Ofn, setResponseKO } from 'oro-functions';

import { getConfigGithubReposMap } from '@/features/config/config-repos.js';
import { getConfigUser } from '@/features/config/config-user.js';
import { apiCreateGithubIssue } from '@/features/github/api/create-github-issue.js';
import { API_GITHUB_ERROR_UNKNOWN, GITHUB_API_URL } from '@/features/github/constants.js';
import { ApiGithubError } from '@/features/github/types.js';

import { GithubNewTaskProps, GithubNewTaskResponse } from './types.js';

export async function fnAction<T, R>(data: T): Promise<R | undefined> {
  const { repo: repoKey, origin, taskId, label, title, type } = data as GithubNewTaskProps;

  // init

  const GITHUBProjects = await getConfigGithubReposMap();

  const repo = GITHUBProjects.get(repoKey);
  if (!repo) {
    Ofn.processWrite({ c: 'redflat', s: `\nError: repo '${repoKey}' not exist\n` });
    return;
  }

  const { user, token } = await getConfigUser({ strict: true });

  // create issue

  const sanitizeTaskId = Ofn.slugify(Ofn.sanitizeFilename(taskId.replace(/[/\\]/g, '-')).toLowerCase())
    .replace(/^-+/, '')
    .replace(/-+$/, '')
    .toUpperCase();

  const issueTitle = `${sanitizeTaskId ? `[${sanitizeTaskId}] ` : ''}${Ofn.capitalize(type)}. ${title}`;

  const issueResponse = await apiCreateGithubIssue(token, repo, {
    title: issueTitle,
    assignee: user.username,
    labels: [label],
  });

  if (!issueResponse.status) {
    Ofn.processWrite({ c: 'redflat', s: `\n${issueResponse.error.msg}\n` });
    return;
  }

  // TODO pending to be finished

  // create merge-request and branch

  const { number: issueNumber, html_url: issueUrl } = issueResponse.issue;

  const branch = `${type}/${sanitizeTaskId ? `${sanitizeTaskId}--` : ''}${issueNumber}-${Ofn.slugify(Ofn.sanitizeFilename(title.replace(/[/\\]/g, '-')).toLowerCase())}`;

  const mergeRequestResponse = await axios
    .post(
      `${GITHUB_API_URL}/repos/${repo.fullname}/pulls`,
      {
        draft: true,
        title: `Draft: Resolve "${issueTitle}"`,
        description: `Closes #${issueNumber}`,
        head: branch,
        base: origin,
      },
      { headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' } },
    )
    .then(({ data }) => Ofn.setResponseOK({ mergeRequest: data }))
    .catch((error) => {
      const githubError: ApiGithubError = error.response
        ? {
            ...error.response.data,
            message: error.response.data.status === '401' ? 'Unauthorized' : error.response.data.message,
          }
        : API_GITHUB_ERROR_UNKNOWN;
      console.log('githubError', githubError);
      return setResponseKO(`Error creating merge-request: ${githubError.status} ${githubError.message}.`, githubError);
    });

  if (!mergeRequestResponse.status) {
    Ofn.processWrite({ c: 'redflat', s: `\n${mergeRequestResponse.error.msg}\n` });
    return;
  }

  // output

  const { html_url: mergeRequestUrl } = mergeRequestResponse.mergeRequest;

  Ofn.processWrites([
    { s: `\n` },
    { s: `✔️ Done!\n` },
    { s: `· new branch: ` },
    { c: 'yellowflat', s: `${branch}\n` },
    { s: `· git command: ` },
    { c: 'green', s: `git fetch && git checkout ${branch}\n` },
    { s: `· issue url: ` },
    { s: `${issueUrl}\n` },
    { s: `· merge request url: ` },
    { s: `${mergeRequestUrl}\n` },
  ]);

  const response: GithubNewTaskResponse = {
    gitRepo: repo.name,
    gitBranch: branch,
  };

  return response as R;
}
