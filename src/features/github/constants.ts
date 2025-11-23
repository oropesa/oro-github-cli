export const API_GITHUB_ERROR_UNKNOWN = {
  message: 'Unknown',
  documentation_url: '',
  status: '418',
};

export const GITHUB_API_URL = 'https://api.github.com' as const;

export const GITHUB_BRANCH_ORDER = ['develop', 'dev', 'pre', 'release', 'main', 'master'];

export const GITHUB_REPO_TYPES = ['feat', 'improve', 'chore', 'bug', 'hotfix', 'test', 'docs'] as const;

export type GithubRepoType = (typeof GITHUB_REPO_TYPES)[number];

export const GITHUB_LABEL_BY_TYPE: Record<GithubRepoType, string[]> = {
  feat: ['feat', 'feature', 'backlog'],
  improve: ['improve', 'backlog'],
  chore: ['chore', 'refactor', 'release'],
  bug: ['bug', 'bugfix'],
  hotfix: ['hotfix'],
  test: ['test', 'testing'],
  docs: ['docs', 'documentation'],
};

// NOTE: It's not required that github-repos have this labels
export const GITHUB_REPO_LABELS = Object.values(GITHUB_LABEL_BY_TYPE).flat();
