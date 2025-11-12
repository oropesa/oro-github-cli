import {
  DEFAULT_IGNORES,
  setEslintLanguageOptionsBrowser,
  setEslintPluginJest,
  setEslintPluginJestDom,
  setEslintPluginPrettier,
  setEslintPluginTypescriptEslint,
  setEslintPluginUnicorn,
} from './eslint.config.utils.js';

const allowList = ['fn', 'dev', 'Dev', 'obj', 'tmp', 'args', 'Args', 'prev', 'utils', 'props', 'Props'];

export default [
  { ignores: DEFAULT_IGNORES },
  setEslintLanguageOptionsBrowser(),
  setEslintPluginUnicorn({ allowList }),
  setEslintPluginJest(),
  setEslintPluginJestDom(),
  setEslintPluginPrettier(),
  ...setEslintPluginTypescriptEslint(),
];
