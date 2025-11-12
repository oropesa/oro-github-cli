import { InteractiveOptionData } from '@/features/yargs/types.js';

export type GithubLoginOptions = Record<keyof GithubLoginProps, InteractiveOptionData>;

export interface GithubLoginProps {
  token: string;
}
