/**
 * NOTE: keytar is not supported in Android environment. Then, to work well in Termux, it's required to be _optional_
 **/
import { customKeytar } from './custom-keytar.js';

export async function getKeytar() {
  try {
    const keytar = await import('keytar');

    return {
      hasKeychain: true,
      getPassword: keytar.default ? keytar.default.getPassword : keytar.getPassword,
      setPassword: keytar.default ? keytar.default.setPassword : keytar.setPassword,
      deletePassword: keytar.default ? keytar.default.deletePassword : keytar.deletePassword,
    };
  } catch {
    return customKeytar;
  }
}
