export const API_GITHUB_ERROR_UNKNOWN = {
  message: 'Unknown',
  documentation_url: '',
  status: '418',
};

export const GITHUB_API_URL = 'https://api.github.com' as const;

export const GITHUB_BRANCH_ORDER = ['develop', 'dev', 'pre', 'release', 'main', 'master'];

export const GITHUB_REPO_TYPES = ['feat', 'improve', 'chore', 'refactor', 'bug', 'hotfix', 'test', 'docs'] as const;

// NOTE: It's recommended that all github-repos have this labels, but it's not a requirement
export const GITHUB_REPO_LABELS = ['feat', 'improve', 'chore', 'refactor', 'bug', 'hotfix', 'test', 'docs'];

export const GITHUB_LABEL_BY_TYPE: Record<string, string> = {
  feat: 'feat',
  improve: 'improve',
  chore: 'chore',
  refactor: 'refactor',
  bug: 'bug',
  hotfix: 'hotfix',
  test: 'test',
  docs: 'docs',
};
