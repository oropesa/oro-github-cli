import { requirementConfigRepos, requirementConfigUser } from '@/features/config/requirements.js';

export function fnRequirement(): Array<Promise<boolean>> {
  return [requirementConfigUser(), requirementConfigRepos()];
}
