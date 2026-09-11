/*
 * Turns unknown parsed JSON (from browser storage or a backup file) into a
 * StoredDraft, or null if it isn't one. Everything is normalised to the shapes
 * the app expects, so a hand-edited or truncated file can never put the
 * planner into a broken state.
 */

import {
  MAX_PRIORITIES,
  SCHEMA_VERSION,
  createPriority,
  type FitAnswer,
  type Plan,
  type PlanTiming,
  type Priority,
  type StoredDraft,
} from '../types';

const FIT_VALUES: FitAnswer[] = ['', 'manageable', 'unsure', 'too-much'];
const TIMING_VALUES: PlanTiming[] = ['', 'now', 'preparing'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function str(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function bool(value: unknown): boolean {
  return value === true;
}

function priorityFrom(value: unknown): Priority {
  const source = isRecord(value) ? value : {};
  return createPriority({
    name: str(source.name),
    reason: str(source.reason),
    usualCommitment: str(source.usualCommitment),
    minimumVersion: str(source.minimumVersion),
    frequency: str(source.frequency),
    timing: str(source.timing),
    paused: bool(source.paused),
    pauseReconsider: str(source.pauseReconsider),
  });
}

function planFrom(value: unknown): Plan {
  const source = isRecord(value) ? value : {};
  const rawPriorities = Array.isArray(source.priorities) ? source.priorities : [];
  const priorities = rawPriorities.slice(0, MAX_PRIORITIES).map(priorityFrom);
  const fit = FIT_VALUES.includes(source.fit as FitAnswer)
    ? (source.fit as FitAnswer)
    : '';
  const timing = TIMING_VALUES.includes(source.timing as PlanTiming)
    ? (source.timing as PlanTiming)
    : '';

  return {
    priorities: priorities.length > 0 ? priorities : [createPriority()],
    fit,
    settingAside: str(source.settingAside),
    timing,
    signs: str(source.signs),
    reviewDate: str(source.reviewDate),
    capacitySigns: str(source.capacitySigns),
    firstStepBack: str(source.firstStepBack),
  };
}

export type MigrateFailure = 'invalid' | 'unsupported-version';

export function readDraft(
  value: unknown,
): { ok: true; draft: StoredDraft } | { ok: false; reason: MigrateFailure } {
  if (!isRecord(value)) return { ok: false, reason: 'invalid' };

  const version = value.version;
  if (typeof version !== 'number' || !Number.isFinite(version)) {
    return { ok: false, reason: 'invalid' };
  }
  if (version > SCHEMA_VERSION) {
    return { ok: false, reason: 'unsupported-version' };
  }
  if (!isRecord(value.plan)) {
    return { ok: false, reason: 'invalid' };
  }

  const step = typeof value.step === 'number' ? value.step : 1;

  return {
    ok: true,
    draft: {
      version: SCHEMA_VERSION,
      savedAt: str(value.savedAt) || new Date().toISOString(),
      step: Math.min(Math.max(Math.round(step), 1), 5),
      completed: bool(value.completed),
      plan: planFrom(value.plan),
    },
  };
}

/** Convenience wrapper for storage reads, where failures simply mean "no draft". */
export function migrateDraft(value: unknown): StoredDraft | null {
  const result = readDraft(value);
  return result.ok ? result.draft : null;
}
