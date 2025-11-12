import fsExtra from 'fs-extra';
import { getFileJsonRecursively, pathExists, setResponseKO, setResponseOK } from 'oro-functions';
import type { SResponseKOSimple, SResponseOKBasic } from 'oro-functions';

import { OGH_CONFIG_FILEPATH } from '@/features/global/constants.js';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { UnknownAny } from '@/features/global/types.js';

import type { Config } from './types.js';

//

export async function getConfig() {
  return await getFileJsonRecursively<Config>(OGH_CONFIG_FILEPATH);
}

//

export async function saveConfig(config: Config): Promise<SResponseOKBasic | SResponseKOSimple> {
  try {
    await fsExtra.writeJson(OGH_CONFIG_FILEPATH, config, { spaces: 2 });
  } catch (error: UnknownAny) {
    return setResponseKO(`${error.toString()}`);
  }

  return (await pathExists(OGH_CONFIG_FILEPATH))
    ? setResponseOK()
    : setResponseKO(`File was not created: ${OGH_CONFIG_FILEPATH}`);
}
