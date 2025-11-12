import process from 'node:process';
import { processWrites } from 'oro-functions';

import { COMMAND_GET_GIT_REPO_NAME, COMMAND_GIT_FETCH_AND_CHECKOUT_BRANCH } from '@/features/git/constants.js';
import { exec } from '@/features/global/utils.js';
import { yargsConfirmation } from '@/features/yargs/functions.js';

import { GithubNewTaskResponse } from './types.js';

export async function fnPostAction<R>(data: R): Promise<void> {
  if (!data) return;

  const { gitRepo, gitBranch } = data as unknown as GithubNewTaskResponse;

  // Check Git Repo

  const { stdout: nameStdout, stderr: _ } = await exec(COMMAND_GET_GIT_REPO_NAME, { cwd: process.cwd() });

  if (nameStdout.trim() !== gitRepo) return;

  // Execute Git Command

  if (!(await yargsConfirmation({ title: 'Do you want to execute the Git command?' }))) return;

  const { stdout, stderr } = await exec(COMMAND_GIT_FETCH_AND_CHECKOUT_BRANCH.replace('{{branch}}', gitBranch), {
    cwd: process.cwd(),
  });

  if (stderr) {
    processWrites([{ s: `\n${stderr}\n` }]);
  }

  if (stdout) {
    processWrites([{ s: `\n${stdout}\n` }]);
  }
}
