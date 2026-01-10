import fsExtra from 'fs-extra';
import { getFileJsonRecursively, strDecrypt, strEncrypt } from 'oro-functions';

import { OGH_TOKEN_FILEPATH } from '@/features/global/constants.js';

/**
 * NOTE: keytar is not supported in Android environment.
 *       Then, to work well in Termux, it's required to be _optional_ and simulate it.
 **/

export const customKeytar = {
  hasKeychain: false,

  getPassword: async (service: string, account: string): Promise<string | null> => {
    const tokenJson = await getFileJsonRecursively<Record<string, string>>(OGH_TOKEN_FILEPATH);

    const decrypted = tokenJson[account] ? strDecrypt(tokenJson[account], account, service) : '';

    return decrypted ? decrypted : null;
  },

  setPassword: async (service: string, account: string, password: string): Promise<void> => {
    const tokenJson = await getFileJsonRecursively<Record<string, string>>(OGH_TOKEN_FILEPATH);

    tokenJson[account] = strEncrypt(password, account, service);

    await fsExtra.writeJson(OGH_TOKEN_FILEPATH, tokenJson);
  },

  deletePassword: async (_service: string, account: string): Promise<boolean> => {
    const tokenJson = await getFileJsonRecursively<Record<string, string>>(OGH_TOKEN_FILEPATH);

    try {
      delete tokenJson[account];

      await fsExtra.writeJson(OGH_TOKEN_FILEPATH, tokenJson);
    } catch {
      return false;
    }

    return true;
  },
};
