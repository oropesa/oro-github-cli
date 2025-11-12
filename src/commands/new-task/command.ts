import type { Argv } from 'yargs';

import { yargsCommand } from '@/features/yargs/main-command.js';

import { fnPostAction } from './action-post.js';
import { fnPreAction } from './action-pre.js';
import { fnAction } from './action.js';
import { fnOptions } from './options.js';
import { fnRequirement } from './requirement.js';
import { fnValidation } from './validation.js';

export const COMMAND_GITHUB_NEW_TASK = 'new-task';
export const COMMAND_GITHUB_NEW_TASK_ALIAS = 'nt';

const commandName = COMMAND_GITHUB_NEW_TASK;
const commandNameAlias = COMMAND_GITHUB_NEW_TASK_ALIAS;
const commandDescription = 'create an issue and pull-request in a github repository';

export async function addCommandGithubNewTask(yargs: Argv) {
  return await yargsCommand({
    yargs,
    commandName,
    commandNameAlias,
    commandDescription,
    fnOptions,
    fnValidation,
    fnRequirement,
    fnAction,
    fnPreAction,
    fnPostAction,
  });
}
