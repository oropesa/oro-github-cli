import { InteractiveOptionData } from '@/features/yargs/types.js';

export type GithubNewTaskOptions = Record<keyof GithubNewTaskProps, InteractiveOptionData>;

export interface GithubNewTaskProps {
  repo: string;
  origin: string;
  taskId: string;
  label: string;
  title: string;
  type: string;
}

export interface GithubNewTaskResponse {
  gitRepo: string;
  gitBranch: string;
}
