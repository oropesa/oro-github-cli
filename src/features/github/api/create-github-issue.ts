import axios, { type AxiosError } from 'axios';
import { setResponseKO, setResponseOK } from 'oro-functions';

import { API_GITHUB_ERROR_UNKNOWN, GITHUB_API_URL } from '../constants.js';
import { ApiGithubError } from '../types.js';
import { ApiGithubIssue } from './create-github-issue.types.js';

export type ApiCreateGithubIssueResponse = ApiGithubIssue;

export async function apiCreateGithubIssue(
  token: string,
  repo: { fullname: string },
  issue: {
    title: string;
    assignee: string;
    labels: string[];
  },
) {
  return await axios
    .post<ApiCreateGithubIssueResponse>(`${GITHUB_API_URL}/repos/${repo.fullname}/issues`, issue, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
    })
    .then(({ data }) => setResponseOK({ issue: data }))
    .catch((error: AxiosError<ApiGithubError>) => {
      const githubError: ApiGithubError = error.response
        ? {
            ...error.response.data,
            message: error.response.data.status === '401' ? 'Unauthorized' : error.response.data.message,
          }
        : API_GITHUB_ERROR_UNKNOWN;

      return setResponseKO(`Error creating issue: ${githubError.status} ${githubError.message}.`, githubError);
    });
}
