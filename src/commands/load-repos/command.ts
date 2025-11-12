import type { Argv } from 'yargs';

import { yargsCommand } from '@/features/yargs/main-command.js';

import { fnAction } from './action.js';
import { fnOptions } from './options.js';
import { fnRequirement } from './requirement.js';
import { fnValidation } from './validation.js';

export const COMMAND_GITHUB_LOAD_REPOS = 'load-repos';
export const COMMAND_GITHUB_LOAD_REPOS_ALIAS = 'lr';

const commandName = COMMAND_GITHUB_LOAD_REPOS;
const commandNameAlias = COMMAND_GITHUB_LOAD_REPOS_ALIAS;
const commandDescription = 'load repositories data from github';

export async function addCommandGithubLoadRepos(yargs: Argv) {
  return await yargsCommand({
    yargs,
    commandName,
    commandNameAlias,
    commandDescription,
    fnOptions,
    fnValidation,
    fnRequirement,
    fnAction,
  });
}
