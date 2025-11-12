import child_process from 'node:child_process';
import { promisify } from 'node:util';

import { UnknownAny } from '@/features/global/types.js';

//

export const exec = promisify(child_process.exec);

//

const ORIGINAL_CONSOLE_WARN = console.warn;
export function disableConsoleWarn() {
  console.warn = function () {};
}

export function enableConsoleWarn() {
  console.warn = ORIGINAL_CONSOLE_WARN;
}

//

export interface BindFunctionArgsProps {
  fn: (...fnArgs: UnknownAny[]) => UnknownAny;
  args: UnknownAny[];
}

export function bindFunctionArgs({ fn, args }: BindFunctionArgsProps) {
  return function (...fnArgs: UnknownAny[]) {
    const argsLength = Math.max((fnArgs ?? []).length, args.length);
    const finalArgs = [];
    for (let index = 0; index < argsLength; index++) {
      finalArgs.push(fnArgs[index] === undefined ? args[index] : fnArgs[index]);
    }

    return fn(...finalArgs);
  };
}

//

export function sortArrayByArray(array: string[], sortArray: string[]) {
  const sortMap = new Map(sortArray.map((item: string, index) => [item, index]));
  return array.toSorted((a, b) => (sortMap.get(a) ?? Infinity) - (sortMap.get(b) ?? Infinity));
}
