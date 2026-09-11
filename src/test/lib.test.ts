import { describe, expect, it } from 'vitest';
import { daysFromToday, formatDisplayDate, isValidISODate, toISODate } from '../lib/date';
import { parseBackup, toBackup } from '../lib/backup';
import { planToText } from '../lib/planText';
import { validateStep } from '../lib/validation';
import { SCHEMA_VERSION, createEmptyPlan, type StoredDraft } from '../types';

describe('local calendar dates', () => {
  it('formats a Date using its local parts, not UTC', () => {
    // 23:30 local on the 1st is still the 1st, whatever the time zone offset.
    const lateEvening = new Date(2026, 0, 1, 23, 30, 0);
    expect(toISODate(lateEvening)).toBe('2026-01-01');
  });

  it('adds days without crossing a time-zone boundary', () => {
    const oneWeek = daysFromToday(7);
    const twoWeeks = daysFromToday(14);
    expect(isValidISODate(oneWeek)).toBe(true);
    expect(isValidISODate(twoWeeks)).toBe(true);

    const [y1, m1, d1] = oneWeek.split('-').map(Number);
    const [y2, m2, d2] = twoWeeks.split('-').map(Number);
    const diff =
      (new Date(y2, m2 - 1, d2).getTime() - new Date(y1, m1 - 1, d1).getTime()) /
      86_400_000;
    expect(Math.round(diff)).toBe(7);
  });

  it('rejects impossible dates', () => {
    expect(isValidISODate('2026-02-30')).toBe(false);
    expect(isValidISODate('2026-13-01')).toBe(false);
    expect(isValidISODate('not-a-date')).toBe(false);
    expect(isValidISODate('2026-09-25')).toBe(true);
  });

  it('displays the same calendar day it was given', () => {
    expect(formatDisplayDate('2026-09-25')).toContain('25');
    expect(formatDisplayDate('2026-09-25')).toContain('2026');
  });
});

describe('validation', () => {
  it('requires at least one named priority in step one', () => {
    const plan = createEmptyPlan();
    expect(validateStep(1, plan)).toHaveLength(1);
    plan.priorities[0].name = 'Learning';
    expect(validateStep(1, plan)).toHaveLength(0);
  });

  it('does not require minimum-version answers for a paused priority', () => {
    const plan = createEmptyPlan();
    plan.priorities[0].name = 'Learning';
    expect(validateStep(2, plan)).toHaveLength(3);
    plan.priorities[0].paused = true;
    expect(validateStep(2, plan)).toHaveLength(0);
  });

  it('never blocks step three, whatever the fit answer', () => {
    const plan = createEmptyPlan();
    plan.fit = 'too-much';
    expect(validateStep(3, plan)).toHaveLength(0);
    plan.fit = '';
    expect(validateStep(3, plan)).toHaveLength(0);
  });

  it('requires a valid review date and capacity signs in step five', () => {
    const plan = createEmptyPlan();
    expect(validateStep(5, plan)).toHaveLength(2);
    plan.reviewDate = '2026-02-30';
    plan.capacitySigns = 'Two calm weeks.';
    expect(validateStep(5, plan)).toHaveLength(1);
    plan.reviewDate = '2026-09-25';
    expect(validateStep(5, plan)).toHaveLength(0);
  });
});

describe('plain-text plan', () => {
  it('omits optional fields that were left empty', () => {
    const plan = createEmptyPlan();
    plan.priorities[0] = {
      ...plan.priorities[0],
      name: 'Physical activity',
      usualCommitment: 'Three workouts a week.',
      minimumVersion: 'A 20-minute session.',
      frequency: 'Twice a week.',
    };
    plan.timing = 'now';
    plan.signs = 'Work is taking more time than usual.';
    plan.reviewDate = '2026-09-25';
    plan.capacitySigns = 'Two calm weeks.';

    const text = planToText(plan);
    expect(text).toContain('- Physical activity');
    expect(text).toContain('Minimum version: A 20-minute session.');
    expect(text).not.toContain('When or where');
    expect(text).not.toContain('First step back');
    expect(text).not.toContain('Why it matters');
  });

  it('lists paused priorities under their own heading', () => {
    const plan = createEmptyPlan();
    plan.priorities[0] = {
      ...plan.priorities[0],
      name: 'Learning',
      paused: true,
      pauseReconsider: 'A quieter month.',
    };
    const text = planToText(plan);
    expect(text).toContain('Paused for now:');
    expect(text).toContain('What would help me reconsider: A quieter month.');
  });
});

describe('backups', () => {
  function draft(): StoredDraft {
    const plan = createEmptyPlan();
    plan.priorities[0].name = 'Relationships';
    return {
      version: SCHEMA_VERSION,
      savedAt: '2026-09-11T00:00:00.000Z',
      step: 3,
      completed: true,
      plan,
    };
  }

  it('round-trips through export and import', () => {
    const result = parseBackup(JSON.stringify(toBackup(draft())));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.draft.plan.priorities[0].name).toBe('Relationships');
    expect(result.draft.completed).toBe(true);
    expect(result.draft.step).toBe(3);
  });

  it('rejects files that are not plans', () => {
    expect(parseBackup('not json')).toEqual({ ok: false, reason: 'invalid' });
    expect(parseBackup('[]')).toEqual({ ok: false, reason: 'invalid' });
    expect(parseBackup('{"version":1}')).toEqual({ ok: false, reason: 'invalid' });
    expect(parseBackup('{"plan":{}}')).toEqual({ ok: false, reason: 'invalid' });
  });

  it('rejects a newer schema version rather than guessing', () => {
    const future = JSON.stringify({ ...toBackup(draft()), version: SCHEMA_VERSION + 1 });
    expect(parseBackup(future)).toEqual({ ok: false, reason: 'unsupported-version' });
  });

  it('normalises unexpected field types instead of trusting them', () => {
    const hostile = JSON.stringify({
      version: SCHEMA_VERSION,
      step: 99,
      completed: 'yes',
      plan: {
        priorities: [{ name: 42, paused: 'true' }, {}, {}, {}, {}],
        fit: 'nonsense',
        timing: { evil: true },
      },
    });
    const result = parseBackup(hostile);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.draft.step).toBe(5);
    expect(result.draft.completed).toBe(false);
    expect(result.draft.plan.priorities).toHaveLength(3);
    expect(result.draft.plan.priorities[0].name).toBe('');
    expect(result.draft.plan.priorities[0].paused).toBe(false);
    expect(result.draft.plan.fit).toBe('');
    expect(result.draft.plan.timing).toBe('');
  });
});
