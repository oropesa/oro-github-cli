import { capitalize, sanitizeFilename, slugify } from 'oro-functions';

export function sanitizeTaskId(taskId?: string) {
  return taskId
    ? slugify(sanitizeFilename(taskId.replace(/[/\\]/g, '-')).toLowerCase())
        .replace(/^-+/, '')
        .replace(/-+$/, '')
        .toUpperCase()
    : '';
}

//

export function sanitizeIssueTitle({ type, title, taskId }: { type: string; title: string; taskId?: string }) {
  const sanitizedTaskId = sanitizeTaskId(taskId);

  return `${sanitizedTaskId ? `[${sanitizedTaskId}] ` : ''}${capitalize(type)}. ${title}`;
}

//

export function sanitizeBranchName(
  { type, title, taskId, issueNumber }: { type: string; title: string; taskId?: string; issueNumber: number },
  config: { requireIssue: true },
): string;
export function sanitizeBranchName(
  { type, title, taskId, issueNumber }: { type: string; title: string; taskId?: string; issueNumber?: never },
  config?: { requireIssue?: false },
): string;
export function sanitizeBranchName(
  { type, title, taskId, issueNumber }: { type: string; title: string; taskId?: string; issueNumber?: number },
  { requireIssue }: { requireIssue?: boolean } = {},
): string {
  const sanitizedTaskId = sanitizeTaskId(taskId);
  const issueID = requireIssue ? `${issueNumber}` : '{issueID}';

  return `${type}/${issueID}${sanitizedTaskId ? `--${sanitizedTaskId}-` : ''}-${slugify(sanitizeFilename(title.replace(/[/\\]/g, '-')).toLowerCase())}`;
}
