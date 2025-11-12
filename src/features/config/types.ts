import { GithubRepo, GithubUser } from '@/features/github/types.js';

export interface Config {
  user?: GithubUser;
  repos?: GithubRepo[];
}
