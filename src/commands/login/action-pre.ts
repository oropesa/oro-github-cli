import { processWrites } from 'oro-functions';

import { GithubLoginOptions } from '@/commands/login/types.js';

export async function fnPreAction<O>(options: O): Promise<void> {
  const { token } = options as unknown as GithubLoginOptions;

  // Show Tip when there is no input-token

  if (!token.default) {
    processWrites([
      { s: '\n' },
      { c: 'purple', s: 'Tip: ' },
      { s: 'You can generate a fine-grained Personal Access Token here https://github.com/settings/tokens \n' },
      { s: "· The minimum required scopes are 'Contents' (read & write), 'Issues' (read & write).\n" },
      { s: '\n' },
    ]);
  }
}
