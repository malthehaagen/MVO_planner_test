import { SCHEMA_VERSION, type StoredDraft } from '../types';
import { readDraft, type MigrateFailure } from './migrate';
import { toISODate } from './date';

export interface BackupFile extends StoredDraft {
  app: 'hagen-growth-mvo-planner';
}

export function toBackup(draft: StoredDraft): BackupFile {
  return {
    app: 'hagen-growth-mvo-planner',
    version: SCHEMA_VERSION,
    savedAt: new Date().toISOString(),
    step: draft.step,
    completed: draft.completed,
    plan: draft.plan,
  };
}

export function backupFilename(): string {
  return `mvo-plan-${toISODate(new Date())}.json`;
}

/** Triggers a download of the backup. Returns false if the browser blocks it. */
export function downloadBackup(draft: StoredDraft): boolean {
  try {
    const json = JSON.stringify(toBackup(draft), null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = backupFilename();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // Revoke on the next tick so the download has started.
    setTimeout(() => URL.revokeObjectURL(url), 0);
    return true;
  } catch {
    return false;
  }
}

export type ParseBackupResult =
  | { ok: true; draft: StoredDraft }
  | { ok: false; reason: MigrateFailure };

export function parseBackup(text: string): ParseBackupResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, reason: 'invalid' };
  }
  return readDraft(parsed);
}
