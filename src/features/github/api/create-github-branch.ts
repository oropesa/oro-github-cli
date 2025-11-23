import axios, { type AxiosError } from 'axios';
import { setResponseKO, setResponseOK } from 'oro-functions';

import { apiGetGithubBranch } from '@/features/github/api/get-github-branch.js';

import { API_GITHUB_ERROR_UNKNOWN, GITHUB_API_URL } from '../constants.js';
import { ApiGithubError } from '../types.js';
import { ApiGithubBranch } from './get-github-branch.types.js';

export interface ApiCreateGithubBranchProps {
  token: string;
  repo: { fullname: string };
  branch: { origin: string; name: string };
}

export async function apiCreateGithubBranch({ token, repo, branch }: ApiCreateGithubBranchProps) {
  const originResponse = await apiGetGithubBranch({ token, repo, branch: { name: branch.origin } });
  if (!originResponse.status) return originResponse;

  return await axios
    .post<ApiGithubBranch>(
      `${GITHUB_API_URL}/repos/${repo.fullname}/git/refs`,
      { ref: `refs/heads/${branch.name}`, sha: originResponse.branch.sha },
      { headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' } },
    )
    .then(({ data }) => setResponseOK({ issue: data }))
    .catch((error: AxiosError<ApiGithubError>) => {
      const githubError: ApiGithubError = error.response
        ? {
            ...error.response.data,
            message: error.response.data.status === '401' ? 'Unauthorized' : error.response.data.message,
          }
        : API_GITHUB_ERROR_UNKNOWN;

      return setResponseKO(`Error creating branch: ${githubError.status} ${githubError.message}.`, githubError);
    });
}
