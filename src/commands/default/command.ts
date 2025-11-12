import type { Argv } from 'yargs';

import { yargsCommand } from '@/features/yargs/main-command.js';

import { fnAction } from './action.js';

export const COMMAND_DEFAULT = '*';

const commandName = COMMAND_DEFAULT;
const commandDescription = 'Welcome';

export async function addCommandDefault(yargs: Argv) {
  return await yargsCommand({ yargs, commandName, commandDescription, fnAction });
}
