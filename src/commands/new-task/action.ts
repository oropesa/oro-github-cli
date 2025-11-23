import { Ofn } from 'oro-functions';

import { getConfigGithubReposMap } from '@/features/config/config-repos.js';
import { getConfigUser } from '@/features/config/config-user.js';
import { apiCreateGithubBranch } from '@/features/github/api/create-github-branch.js';
import { apiCreateGithubIssue } from '@/features/github/api/create-github-issue.js';
import { sanitizeBranchName, sanitizeIssueTitle } from '@/features/github/utils.js';

import { GithubNewTaskProps, GithubNewTaskResponse } from './types.js';

export async function fnAction<T, R>(data: T): Promise<R | undefined> {
  const { repo: repoKey, origin, taskId, label, title, type } = data as GithubNewTaskProps;

  // init

  const githubRepos = await getConfigGithubReposMap();

  const repo = githubRepos.get(repoKey);
  if (!repo) {
    Ofn.processWrite({ c: 'redflat', s: `\nError: repo '${repoKey}' not exist\n` });
    return;
  }

  const { user, token } = await getConfigUser({ strict: true });

  // create issue

  const issue = {
    title: sanitizeIssueTitle({ type, title, taskId }),
    assignee: user.username,
    labels: [label],
  };

  const issueResponse = await apiCreateGithubIssue({ token, repo, issue });
  if (!issueResponse.status) {
    Ofn.processWrite({ c: 'redflat', s: `\n${issueResponse.error.msg}\n` });
    return;
  }

  // create branch

  const { number: issueNumber, html_url: issueUrl } = issueResponse.issue;

  const branchName = sanitizeBranchName({ type, title, taskId, issueNumber }, { requireIssue: true });

  const branchResponse = await apiCreateGithubBranch({ token, repo, branch: { origin, name: branchName } });
  if (!branchResponse.status) {
    Ofn.processWrite({ c: 'red', s: `\n${branchResponse.error.msg}\n` });
    return;
  }

  // output

  Ofn.processWrites([
    { s: `\n` },
    { s: `✔️ Done!\n` },
    { s: `· new branch: ` },
    { c: 'yellowflat', s: `${branchName}\n` },
    { s: `· git command: ` },
    { c: 'greenflat', s: `git fetch && git checkout ${branchName}\n` },
    { s: `· issue url: ` },
    { s: `${issueUrl}\n` },
  ]);

  const response: GithubNewTaskResponse = {
    gitRepo: repo.name,
    gitBranch: branchName,
  };

  return response as R;
}
