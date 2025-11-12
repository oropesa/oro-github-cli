import axios, { type AxiosError } from 'axios';
import { setResponseKO, setResponseOK } from 'oro-functions';

import { API_GITHUB_ERROR_UNKNOWN, GITHUB_API_URL } from '../constants.js';
import { ApiGithubError, GithubUser } from '../types.js';
import { ApiGithubUser } from './get-github-user.types.js';

export async function apiGetGithubUser(token: string) {
  const userResponse = await axios
    .get<ApiGithubUser>(`${GITHUB_API_URL}/user`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
    })
    .then(({ data }) => {
      const user: GithubUser = {
        userid: String(data.id),
        username: data.login,
        name: data.name,
        email: data.email,
      };

      return setResponseOK({ user });
    })
    .catch((error: AxiosError<ApiGithubError>) => {
      const githubError: ApiGithubError = error.response
        ? {
            ...error.response.data,
            message: error.response.data.status === '401' ? 'Unauthorized' : error.response.data.message,
          }
        : API_GITHUB_ERROR_UNKNOWN;

      return setResponseKO(`Error getting user: ${githubError.status} ${githubError.message}.`, githubError);
    });

  if (!userResponse.status) return userResponse;

  return setResponseOK(userResponse.user);
}
