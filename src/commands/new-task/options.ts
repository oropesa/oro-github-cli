import { getConfigGithubReposMap } from '@/features/config/config-repos.js';
import { GITHUB_LABEL_BY_TYPE, GITHUB_REPO_LABELS, GITHUB_REPO_TYPES } from '@/features/github/constants.js';
import { sortArrayByArray } from '@/features/global/utils.js';
import { InteractiveOption } from '@/features/yargs/types.js';

import { GithubNewTaskOptions } from './types.js';

export async function fnOptions(): Promise<InteractiveOption> {
  const reposMap = await getConfigGithubReposMap();

  const options: GithubNewTaskOptions = {
    repo: {
      type: 'list',
      describe: 'Select repository:',
      choices: [...reposMap.keys()],
    },
    origin: {
      type: 'list',
      describe: 'Select origin branch:',
      // @ts-expect-error choices could be a function when 'when' prop exists
      choices: (argv) => reposMap.get(argv.repo)?.branches.map((name) => name) ?? [],
      // @ts-expect-error when 'choices' is a function, 'default' must be a function
      default: (argv, defaults) => {
        if (!argv?.repo) return;

        const repo = reposMap.get(argv.repo);

        const defaultOrigin = defaults?.origin
          ? (repo?.branches ?? []).find(({ name }) => name === defaults.origin)?.name
          : undefined;

        return defaultOrigin ?? repo?.defaultBranch ?? undefined;
      },
    },
    taskId: {
      type: 'input',
      describe: 'Enter task ID:',
    },
    type: {
      type: 'list',
      describe: 'Select type:',
      choices: [...GITHUB_REPO_TYPES],
    },
    label: {
      type: 'list',
      describe: 'Select label:',
      // @ts-expect-error choices could be a function when 'when' prop exists
      choices: (argv) => {
        return sortArrayByArray(reposMap.get(argv?.repo)?.labels.map(({ name }) => name) ?? [], GITHUB_REPO_LABELS);
      },
      // @ts-expect-error when 'choices' is a function, 'default' must be a function
      default: (argv, defaults) => {
        if (!argv?.repo) return;

        const repoLabels = sortArrayByArray(
          reposMap.get(argv?.repo)?.labels.map(({ name }) => name) ?? [],
          GITHUB_REPO_LABELS,
        );

        const allowedDefault = defaults?.label ? repoLabels.find((label) => label === defaults.label) : undefined;
        if (allowedDefault) return allowedDefault;

        const defaultLabelByType = GITHUB_LABEL_BY_TYPE[argv?.type];
        return defaultLabelByType ? repoLabels.find((label) => label === defaultLabelByType) : undefined;
      },
    },
    title: {
      type: 'input',
      describe: 'Enter issue title:',
    },
  };

  return options;
}
