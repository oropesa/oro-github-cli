import { Ofn } from 'oro-functions';
import type { Argv } from 'yargs';
import yargsInteractive from 'yargs-interactive';

import { disableConsoleWarn, enableConsoleWarn } from '@/features/global/utils.js';

import { yargsConfirmation, yargsTryAgain } from './functions.js';
import { yargsGetOptions, yargsSanitizeInteractiveOptions } from './options.js';
import type { InteractiveOption, InteractiveOptionDataDefaults } from './types.js';

//

interface YargsCommandProps {
  yargs: Argv;
  commandName: string;
  commandNameAlias?: string;
  commandDescription: string;
  fnOptions?: () => Promise<InteractiveOption>;
  fnRequirement?: () => Array<Promise<boolean>>;
  fnValidation?: <T>(data: T) => Promise<boolean>;
  fnAction: <T>(data: T) => Promise<void>;
  fnPreAction?: <O>(data: O) => Promise<void>;
  fnPostAction?: <R>(data?: R) => Promise<void>;
}

export async function yargsCommand({
  yargs,
  commandName,
  commandNameAlias,
  commandDescription,
  fnOptions,
  fnRequirement,
  fnValidation,
  fnAction,
  fnPreAction,
  fnPostAction,
}: YargsCommandProps) {
  const interactiveOptions = fnOptions ? yargsSanitizeInteractiveOptions(await fnOptions()) : {};
  const yargsOptions = yargsGetOptions(interactiveOptions);

  const hasOptions = Object.keys(yargsOptions).length > 0;

  return yargs.command(
    [`${commandName}${hasOptions ? ' [options]' : ''}`, ...(commandNameAlias ? [commandNameAlias] : [])],
    commandDescription,
    (yargs) => {
      if (commandName !== '*') {
        yargs.version(false);
      }

      if (Object.keys(yargsOptions).length > 0) {
        yargs.options(yargsOptions);
      }
    },
    async ({ _, $0: _1, interactive: _2, ...scriptArgv }) => {
      let scriptInteractiveOptions = yargsSanitizeInteractiveOptions(
        interactiveOptions,
        scriptArgv as InteractiveOptionDataDefaults,
      );

      let actionResponse;
      do {
        if (fnRequirement) {
          const requirements = await Promise.all(fnRequirement());
          if (requirements.includes(false)) return;
        }

        if (fnPreAction) {
          await fnPreAction(scriptInteractiveOptions);
        }

        // NOTE: yargsInteractive allows dependant choices, but their lib-code launch an annoying console.warn
        disableConsoleWarn();
        const argv = await yargsInteractive().interactive(scriptInteractiveOptions);
        const { _, $0: _1, interactive: _2, ...result } = argv;
        enableConsoleWarn();

        if (fnValidation && !(await fnValidation(result))) {
          if (await yargsTryAgain()) {
            Ofn.processWrite(`\n`);
            scriptInteractiveOptions = yargsSanitizeInteractiveOptions(scriptInteractiveOptions, result);
            continue;
          }

          return;
        }

        if (fnValidation && !(await yargsConfirmation({ title: 'Do you want to execute this?' }))) {
          if (await yargsTryAgain()) {
            Ofn.processWrite(`\n`);
            scriptInteractiveOptions = yargsSanitizeInteractiveOptions(interactiveOptions, result);
            continue;
          }

          return;
        }

        actionResponse = await fnAction(result);
        break;

        // eslint-disable-next-line no-constant-condition
      } while (true);

      if (fnPostAction) {
        await fnPostAction(actionResponse);
      }
    },
  );
}
