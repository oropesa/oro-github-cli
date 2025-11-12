import { SResponseKOSimple, SResponseOKBasic, processWrites } from 'oro-functions';

import { GithubRepo } from '@/features/github/types.js';

import { getConfig, saveConfig } from './config.js';

//

export interface GetConfigRepos {
  repos: GithubRepo[];
}

export async function getConfigRepos(props: { verbose?: boolean; strict: true }): Promise<GetConfigRepos>;
export async function getConfigRepos(props?: { verbose?: boolean; strict?: false }): Promise<Partial<GetConfigRepos>>;
export async function getConfigRepos({
  verbose = true,
  strict = false,
}: { verbose?: boolean; strict?: boolean } = {}): Promise<Partial<GetConfigRepos>> {
  const config = await getConfig();

  // get user

  const repos = config?.repos;
  if (!repos || repos.length === 0) {
    if (verbose) {
      processWrites([
        { s: '\n' },
        { c: 'redflat', s: 'Error: ', a: ['bold'] },
        { c: 'redflat', s: `There is no repositories. You need to "ogh load-repos" first.` },
        { s: '\n\n' },
      ]);
    }

    if (strict) {
      throw new Error('Cannot get config-repos');
    }

    return { repos: [] };
  }

  return { repos: config!.repos };
}

//

export async function saveConfigGithubRepos(repos: GithubRepo[]): Promise<SResponseOKBasic | SResponseKOSimple> {
  const prevConfig = await getConfig();

  return await saveConfig({ ...prevConfig, repos });
}

//

export async function getConfigGithubReposMap(): Promise<Map<string, GithubRepo>> {
  const { repos } = await getConfigRepos();

  return repos ? new Map(repos.map((repo) => [repo.name, repo])) : new Map<string, GithubRepo>();
}
