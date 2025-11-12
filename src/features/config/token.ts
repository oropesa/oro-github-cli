import keytar from 'keytar';
import os from 'node:os';
import { setResponseKO, setResponseOK, slugify } from 'oro-functions';
import type { SResponseKOSimple, SResponseOKBasic } from 'oro-functions';

import { OGH_PROJECT } from '@/features/global/constants.js';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { UnknownAny } from '@/features/global/types.js';

//

export async function getUserToken() {
  try {
    const username = slugify(os.userInfo().username ?? 'unknown');

    const token = await keytar.getPassword(OGH_PROJECT, username);

    return token ? setResponseOK({ token }) : setResponseKO('Error: token not found');
  } catch (error: UnknownAny) {
    return setResponseKO(`${error.toString()}`);
  }
}

//

export async function saveUserToken(token: string): Promise<SResponseOKBasic | SResponseKOSimple> {
  try {
    const username = slugify(os.userInfo().username ?? 'unknown');

    await keytar.setPassword(OGH_PROJECT, username, token);

    return setResponseOK();
  } catch (error: UnknownAny) {
    return setResponseKO(`${error.toString()}`);
  }
}

//

export async function deleteUserToken() {
  try {
    const username = slugify(os.userInfo().username ?? 'unknown');

    await keytar.deletePassword(OGH_PROJECT, username);

    return setResponseOK();
  } catch (error: UnknownAny) {
    return setResponseKO(`${error.toString()}`);
  }
}
