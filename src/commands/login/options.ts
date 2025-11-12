import { InteractiveOption } from '@/features/yargs/types.js';

import { GithubLoginOptions } from './types.js';

export async function fnOptions(): Promise<InteractiveOption> {
  const options: GithubLoginOptions = {
    token: {
      type: 'password',
      describe: 'Paste your authentication token',
    },
  };

  return options;
}
