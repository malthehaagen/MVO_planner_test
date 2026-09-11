/** The plan data model. Bump SCHEMA_VERSION whenever these shapes change. */

export const SCHEMA_VERSION = 1;

export interface Priority {
  /** Stable id used for React keys and field ids. */
  id: string;
  name: string;
  /** Optional: why this matters to the person. */
  reason: string;
  usualCommitment: string;
  minimumVersion: string;
  frequency: string;
  /** Optional: when or where it will happen. */
  timing: string;
  paused: boolean;
  /** Optional: what would help them reconsider the pause. */
  pauseReconsider: string;
}

export type FitAnswer = '' | 'manageable' | 'unsure' | 'too-much';

export type PlanTiming = '' | 'now' | 'preparing';

export interface Plan {
  priorities: Priority[];
  fit: FitAnswer;
  settingAside: string;
  timing: PlanTiming;
  signs: string;
  /** Local calendar date, stored as YYYY-MM-DD. */
  reviewDate: string;
  capacitySigns: string;
  firstStepBack: string;
}

export interface StoredDraft {
  version: number;
  savedAt: string;
  /** Step the person was last on, 1-5. */
  step: number;
  /** True once they have pressed "Create my MVO plan". */
  completed: boolean;
  plan: Plan;
}

export const MAX_PRIORITIES = 3;

export function createPriority(partial: Partial<Priority> = {}): Priority {
  return {
    id:
      globalThis.crypto?.randomUUID?.() ??
      `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    name: '',
    reason: '',
    usualCommitment: '',
    minimumVersion: '',
    frequency: '',
    timing: '',
    paused: false,
    pauseReconsider: '',
    ...partial,
  };
}

export function createEmptyPlan(): Plan {
  return {
    priorities: [createPriority()],
    fit: '',
    settingAside: '',
    timing: '',
    signs: '',
    reviewDate: '',
    capacitySigns: '',
    firstStepBack: '',
  };
}
