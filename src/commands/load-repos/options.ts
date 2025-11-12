import { InteractiveOption } from '@/features/yargs/types.js';

import { GithubLoadReposOptions } from './types.js';

export async function fnOptions(): Promise<InteractiveOption> {
  const options: GithubLoadReposOptions = {
    detailed: {
      alias: 'd',
      type: 'confirm',
      describe: 'Show detailed data before to save repos',
      default: false,
      prompt: 'never',
    },
  };

  return options;
}
