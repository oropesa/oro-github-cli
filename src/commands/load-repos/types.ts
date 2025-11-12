import { InteractiveOptionData } from '@/features/yargs/types.js';

export type GithubLoadReposOptions = Record<keyof GithubLoadReposProps, InteractiveOptionData>;

export interface GithubLoadReposProps {
  detailed: false;
}
