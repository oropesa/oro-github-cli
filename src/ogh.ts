#!/usr/bin/env node
import yargs, { Argv } from 'yargs';
import { hideBin } from 'yargs/helpers';

import { addCommands } from '@/commands/index.js';
import { OGH_VERSION } from '@/features/global/constants.js';

export async function oroCli(argv: string[]): Promise<Argv> {
  const cliYargs = yargs(argv).version(OGH_VERSION).alias('v', 'version').strict(true);

  await addCommands(cliYargs);

  return new Promise((resolve) => {
    resolve(cliYargs);
  });
}

// eslint-disable-next-line unicorn/prefer-top-level-await
oroCli(hideBin(process.argv)).then((yargs) => yargs.parse());
