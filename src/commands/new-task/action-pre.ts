import * as process from 'node:process';

import { COMMAND_GET_GIT_REPO_NAME } from '@/features/git/constants.js';
import { exec } from '@/features/global/utils.js';

import { GithubNewTaskOptions } from './types.js';

export async function fnPreAction<O>(options: O): Promise<void> {
  const { repo } = options as unknown as GithubNewTaskOptions;

  // Check git-repo and set it by default when there is no default-repo

  if (!(repo.default as string[])?.[0]) {
    const { stdout, stderr: _ } = await exec(COMMAND_GET_GIT_REPO_NAME, { cwd: process.cwd() });

    const gitRepo = stdout.trim();
    if (gitRepo && repo.choices?.includes(gitRepo)) {
      repo.default = gitRepo;
    }
  }
}
