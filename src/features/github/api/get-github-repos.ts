import axios, { type AxiosError } from 'axios';
import { processWrites, setResponseKO, setResponseOK } from 'oro-functions';

import { API_GITHUB_ERROR_UNKNOWN, GITHUB_API_URL } from '../constants.js';
import { ApiGithubError, GithubRepo, GithubRepoBranch, GithubRepoLabel } from '../types.js';
import { ApiGithubRepo, ApiGithubRepoBranch, ApiGithubRepoLabel } from './get-github-repos.types.js';

export type ApiGetGithubReposResponse = ApiGithubRepo[];

export const PER_PAGE = 100;

export async function apiGetGithubRepos(token: string, verbose = false) {
  // get repos

  if (verbose) {
    processWrites([{ s: `\nLoading repositories... ` }]);
  }

  const repoMap: Map<string, GithubRepo> = new Map<string, GithubRepo>();

  let page = 1;

  do {
    const listResponse = await axios
      .get<ApiGetGithubReposResponse>(`${GITHUB_API_URL}/user/repos?per_page=${PER_PAGE}&page=${page}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
      })
      .then(({ data }) => setResponseOK({ data }))
      .catch((error: AxiosError<ApiGithubError>) => {
        const githubError: ApiGithubError = error.response
          ? {
              ...error.response.data,
              message: error.response.data.status === '401' ? 'Unauthorized' : error.response.data.message,
            }
          : API_GITHUB_ERROR_UNKNOWN;

        return setResponseKO(`Error getting repos: ${githubError.status} ${githubError.message}.`, githubError);
      });

    if (!listResponse.status) {
      if (verbose) {
        processWrites([{ c: 'redflat', s: `Failed` }, { s: '\n' }]);
      }

      return listResponse;
    }

    const { data: githubRepos } = listResponse;

    for (const repo of githubRepos) {
      repoMap.set(String(repo.id), {
        id: String(repo.id),
        name: repo.name,
        fullname: repo.full_name,
        owner: repo.owner.login,
        webUrl: repo.html_url,
        defaultBranch: repo.default_branch,
        branches: [],
        labels: [],
      });
    }

    if (githubRepos.length < PER_PAGE) {
      break;
    }

    page++;
    // eslint-disable-next-line no-constant-condition
  } while (true);

  // get repo branches

  if (verbose) {
    processWrites([{ s: `branches... labels... ` }]);
  }

  const branchResponses = await Promise.all(
    [...repoMap.values()].map(async ({ id: repoId, fullname, defaultBranch }) => {
      const repoBranches = setResponseOK({
        repoId,
        branches: [] as GithubRepoBranch[],
        labels: [] as GithubRepoLabel[],
      });

      let page = 1;

      do {
        const listResponse = await axios
          .get<ApiGithubRepoBranch[]>(
            `${GITHUB_API_URL}/repos/${fullname}/branches?per_page=${PER_PAGE}&page=${page}`,
            { headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' } },
          )
          .then(({ data }) =>
            setResponseOK({
              branches: data.map((branch) => ({
                name: branch.name,
                protected: branch.protected,
              })),
            }),
          )
          .catch((error: AxiosError<ApiGithubError>) => {
            const githubError: ApiGithubError = error.response
              ? {
                  ...error.response.data,
                  message: error.response.data.status === '401' ? 'Unauthorized' : error.response.data.message,
                }
              : API_GITHUB_ERROR_UNKNOWN;

            return setResponseKO(`Error getting branches: ${githubError.status} ${githubError.message}.`, githubError);
          });

        if (!listResponse.status) {
          return listResponse;
        }

        const { branches } = listResponse;

        repoBranches.branches = [...repoBranches.branches, ...branches];

        if (branches.length < PER_PAGE) {
          break;
        }

        page++;
        // eslint-disable-next-line no-constant-condition
      } while (true);

      repoBranches.branches.sort(branchSorter);

      // NOTE: ensure defaultBranch exists

      if (!repoBranches.branches.some(({ name }) => name === defaultBranch)) {
        repoBranches.branches = [{ name: defaultBranch, protected: false }, ...repoBranches.branches];
      }

      //

      const labelResponse = await axios
        .get<ApiGithubRepoLabel[]>(`${GITHUB_API_URL}/repos/${fullname}/labels?per_page=${PER_PAGE}&page=${page}`, {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
        })
        .then(({ data }) =>
          setResponseOK({
            labels: data
              .map(({ name, description, color }): GithubRepoLabel => ({ name, description, color }))
              .toSorted(),
          }),
        )
        .catch((error) => {
          const githubError: ApiGithubError = error.response
            ? {
                ...error.response.data,
                message: error.response.data.status === '401' ? 'Unauthorized' : error.response.data.message,
              }
            : API_GITHUB_ERROR_UNKNOWN;
          console.log('githubError', githubError);
          return setResponseKO(`Error getting labels: ${githubError.status} ${githubError.message}.`, githubError);
        });

      if (!labelResponse.status) return labelResponse;

      const { labels } = labelResponse;

      //

      repoBranches.labels = labels;

      return repoBranches;
    }),
  );

  //

  const repos: GithubRepo[] = [];
  for (const branchResponse of branchResponses) {
    if (!branchResponse.status) {
      if (verbose) {
        processWrites([{ c: 'redflat', s: `Failed` }, { s: '\n' }]);
      }

      return branchResponse;
    }

    repos.push({
      ...repoMap.get(branchResponse.repoId)!,
      branches: branchResponse.branches,
      labels: branchResponse.labels,
    });
  }

  repos.sort((a, b) => a.name.localeCompare(b.name));

  if (verbose) {
    processWrites([{ c: 'greenflat', s: `Done` }, { s: '\n' }]);
  }

  return setResponseOK({ repos });
}

//

export const DEFAULT_BRANCHES_ORDER = ['develop', 'dev', 'pre', 'release', 'main', 'master'];

function branchSorter(a: GithubRepoBranch, b: GithubRepoBranch): number {
  const aIndex = DEFAULT_BRANCHES_ORDER.indexOf(a.name);
  const bIndex = DEFAULT_BRANCHES_ORDER.indexOf(b.name);

  // If both are in the custom order, compare their order
  if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
  // If only one is in the custom order, prioritize it
  if (aIndex !== -1) return -1;
  if (bIndex !== -1) return 1;

  // If none are in the custom order, sort by name
  return a.name.localeCompare(b.name);
}
