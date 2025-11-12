import type { Argv } from 'yargs';

import { addCommandDefault } from './default/command.js';
import { addCommandGithubLoadRepos } from './load-repos/command.js';
import { addCommandGithubLogin } from './login/command.js';
import { addCommandGithubNewTask } from './new-task/command.js';

export async function addCommands(yargs: Argv) {
  await addCommandDefault(yargs);
  await addCommandGithubLogin(yargs);
  await addCommandGithubLoadRepos(yargs);
  await addCommandGithubNewTask(yargs);
  // Add more commands here
}
