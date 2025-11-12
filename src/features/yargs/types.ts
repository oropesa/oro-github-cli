import type { Options as YOptionData } from 'yargs';
import type { Option as YIntOption, OptionData as YIntOptionData } from 'yargs-interactive';

//

export type InteractiveOptionDataDefaults = Record<string, YIntOptionData['default']>;

export type InteractiveOption = YIntOption;

export type InteractiveOptionData = YIntOptionData & { alias?: string };

export type YargsOptionData = YOptionData;
