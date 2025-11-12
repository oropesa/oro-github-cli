import { GithubUser } from '@/features/github/types.js';

export const DEFAULT_CONFIG_USER: GithubUser = {
  userid: '',
  username: '',
  name: '',
  email: '',
} as const;
