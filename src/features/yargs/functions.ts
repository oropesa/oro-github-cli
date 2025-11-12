import { processWrites } from 'oro-functions';
import yargsInteractive from 'yargs-interactive';

//

interface YargsConfirmationProps {
  title?: string;
}

export async function yargsConfirmation({ title = 'Are you sure?' }: YargsConfirmationProps): Promise<boolean> {
  const { confirmation } = await yargsInteractive().interactive({
    interactive: { default: true },
    confirmation: { type: 'list', describe: title, choices: ['Yes', 'No'] },
  });

  return confirmation === 'Yes';
}

//

interface YargsRetryAgainProps {
  title?: string;
  rejected?: string;
}

export async function yargsTryAgain({
  title = 'Do you want to try it again',
  rejected = `\nCommand rejected\n`,
}: YargsRetryAgainProps = {}): Promise<boolean> {
  const { retryAgain } = await yargsInteractive().interactive({
    interactive: { default: true },
    retryAgain: { type: 'list', describe: title, choices: ['Yes', 'No'], default: 'No', prompt: 'always' },
  });

  if (retryAgain !== 'Yes') {
    processWrites([{ c: 'redflat', s: rejected, a: ['bold'] }]);
  }

  return retryAgain === 'Yes';
}
