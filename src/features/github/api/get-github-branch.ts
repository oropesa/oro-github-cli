import axios, { type AxiosError } from 'axios';
import { setResponseKO, setResponseOK } from 'oro-functions';

import { API_GITHUB_ERROR_UNKNOWN, GITHUB_API_URL } from '../constants.js';
import { ApiGithubError, GithubBranch } from '../types.js';
import { ApiGithubBranch } from './get-github-branch.types.js';

export interface ApiGetGithubBranchProps {
  token: string;
  repo: { fullname: string };
  branch: { name: string };
}

export async function apiGetGithubBranch({ token, repo, branch }: ApiGetGithubBranchProps) {
  return await axios
    .get<ApiGithubBranch>(`${GITHUB_API_URL}/repos/${repo.fullname}/git/ref/heads/${branch.name}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
    })
    .then(({ data }) => {
      const branch: GithubBranch = {
        ref: data.ref,
        name: data.ref.replace('refs/heads/', ''),
        sha: data.object.sha,
      };

      return setResponseOK({ branch });
    })
    .catch((error: AxiosError<ApiGithubError>) => {
      const githubError: ApiGithubError = error.response
        ? {
            ...error.response.data,
            message: error.response.data.status === '401' ? 'Unauthorized' : error.response.data.message,
          }
        : API_GITHUB_ERROR_UNKNOWN;

      return setResponseKO(
        `Error getting branch '${branch}': ${githubError.status} ${githubError.message}.`,
        githubError,
      );
    });
}
