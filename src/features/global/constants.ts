import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getFileJsonRecursivelySync, getFolderByPath } from 'oro-functions';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//

export const OGH_PROJECT = 'oro-github-cli';

export const OGH_FOLDER = getFolderByPath(__dirname);

const { version } = getFileJsonRecursivelySync<{ version: string }>(`${OGH_FOLDER}/package.json`);
export const OGH_VERSION = `v${version}`;

export const OGH_CONFIG_FILE = `ogh-config.json`;
export const OGH_CONFIG_FILEPATH = `${OGH_FOLDER}/${OGH_CONFIG_FILE}`;
