import { Ofn } from 'oro-functions';

import { UnknownAny } from '@/features/global/types.js';
import { bindFunctionArgs } from '@/features/global/utils.js';

import type {
  InteractiveOption,
  InteractiveOptionData,
  InteractiveOptionDataDefaults,
  YargsOptionData,
} from './types.js';

//

export function yargsCastInteractiveType(inType: InteractiveOptionData['type']): YargsOptionData['type'] {
  switch (inType) {
    case 'number':
      return 'number';
    case 'confirm':
      return 'boolean';
    case 'list':
      return 'array';
    case 'rawlist':
      return 'array';
    // case 'input':
    // case 'expand':
    // case 'checkbox':
    // case 'password':
    // case 'editor':
    default:
      return 'string';
  }
}

//

export function yargsSanitizeInteractiveOptions(
  intOptions: InteractiveOption,
  defaults?: InteractiveOptionDataDefaults,
): InteractiveOption {
  const options: InteractiveOption = {
    interactive: { default: true },
    ...intOptions,
  };

  for (const key of Object.keys(options)) {
    if (key === 'interactive') {
      options[key].default = true;
      continue;
    }

    (options[key] as InteractiveOptionData).prompt = (options[key] as InteractiveOptionData).prompt ?? 'always';

    // NOTE: 'default' as a function should happen only when 'choices' is a function too
    if (Ofn.isFunction((options[key] as InteractiveOptionData).default)) {
      // NOTE: when 'default' is a function, bind 'defaults' as second param,
      //       because it doesn't exist for 'yargs-default' function
      (options[key] as InteractiveOptionData).default = bindFunctionArgs({
        fn: (options[key] as InteractiveOptionData).default as UnknownAny,
        args: [undefined, defaults],
      }) as unknown as InteractiveOptionData['default'];
    } else {
      (options[key] as InteractiveOptionData).default =
        // NOTE: When 'type' === 'list', the 'defaults' value is '[ undefined ]' when it's empty
        (options[key] as InteractiveOptionData).type === 'list'
          ? (defaults?.[key] as UnknownAny)?.[0]
            ? defaults?.[key]
            : (options[key] as InteractiveOptionData).default
          : // NOTE: This is the common behavior, inherited by 'defaults', or take the 'option.default'
            (defaults?.[key] ?? (options[key] as InteractiveOptionData).default);
    }
  }

  return options;
}

//

export function yargsGetOptions(intOptions: InteractiveOption) {
  const options: Record<string, YargsOptionData> = {};

  const { interactive: _, ...rest } = intOptions;

  for (const key of Object.keys(rest)) {
    const { type, ...interactiveOption } = intOptions[key] as InteractiveOptionData;

    options[key] = {
      type: yargsCastInteractiveType(type),
      ...interactiveOption,
    };

    if (typeof (options[key] as InteractiveOptionData).choices === 'function') {
      (options[key] as InteractiveOptionData).describe =
        `${(options[key] as InteractiveOptionData).describe}[depends on ${(options[key] as UnknownAny).when}]`;
      (options[key] as InteractiveOptionData).choices = [];
    }
  }

  return options;
}
