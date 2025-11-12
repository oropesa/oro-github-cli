import type { Argv } from 'yargs';

import { yargsCommand } from '@/features/yargs/main-command.js';

import { fnPreAction } from './action-pre.js';
import { fnAction } from './action.js';
import { fnOptions } from './options.js';
import { fnValidation } from './validation.js';

export const COMMAND_GITHUB_LOGIN = 'login';

const commandName = COMMAND_GITHUB_LOGIN;
const commandDescription = 'Login in github';

export async function addCommandGithubLogin(yargs: Argv) {
  return await yargsCommand({
    yargs,
    commandName,
    commandDescription,
    fnOptions,
    fnValidation,
    fnPreAction,
    fnAction,
  });
}
