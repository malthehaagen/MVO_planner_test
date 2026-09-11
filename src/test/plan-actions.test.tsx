import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../App';
import { STORAGE_KEY } from '../lib/storage';
import { SCHEMA_VERSION, createEmptyPlan, type StoredDraft } from '../types';
import { toBackup } from '../lib/backup';

function completedDraft(name = 'Physical activity'): StoredDraft {
  const plan = createEmptyPlan();
  plan.priorities[0] = {
    ...plan.priorities[0],
    name,
    reason: 'It keeps me steady.',
    usualCommitment: 'Three hour-long workouts each week.',
    minimumVersion: 'A 20-minute session.',
    frequency: 'Twice a week.',
    timing: 'Tuesday and Saturday after work.',
  };
  plan.timing = 'now';
  plan.signs = 'Work is taking more time than usual.';
  plan.settingAside = 'Weekend long runs.';
  plan.reviewDate = '2026-09-25';
  plan.capacitySigns = 'Two calm weeks in a row.';
  plan.firstStepBack = 'Add a third session back.';
  return {
    version: SCHEMA_VERSION,
    savedAt: new Date().toISOString(),
    step: 5,
    completed: true,
    plan,
  };
}

function seedStorage(draft: StoredDraft) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}

async function openSavedPlan(user: ReturnType<typeof userEvent.setup>) {
  render(<App />);
  await user.click(screen.getByRole('button', { name: 'Continue my plan' }));
  await screen.findByRole('heading', { name: 'My minimum viable output plan' });
}

describe('finished plan actions', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it('copies a structured plain-text plan', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    seedStorage(completedDraft());
    await openSavedPlan(user);

    await user.click(screen.getByRole('button', { name: 'Copy plan' }));

    expect(writeText).toHaveBeenCalledTimes(1);
    const text: string = writeText.mock.calls[0][0];
    expect(text).toContain('My minimum viable output plan');
    expect(text).toContain('- Physical activity');
    expect(text).toContain('Minimum version: A 20-minute session.');
    expect(text).toContain('Review date:');
    expect(text).toContain('At your review, decide what still fits');
    expect(await screen.findByText('Plan copied to the clipboard.')).toBeInTheDocument();
  });

  it('reports a clipboard failure instead of pretending it worked', async () => {
    const user = userEvent.setup();
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
    });
    // The legacy fallback is unavailable too.
    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      value: () => false,
    });

    seedStorage(completedDraft());
    await openSavedPlan(user);
    await user.click(screen.getByRole('button', { name: 'Copy plan' }));

    expect(await screen.findByText(/Copying didn’t work in this browser/)).toBeInTheDocument();
  });

  it('opens the browser print dialog', async () => {
    const user = userEvent.setup();
    const print = vi.fn();
    Object.assign(window, { print });

    seedStorage(completedDraft());
    await openSavedPlan(user);
    await user.click(screen.getByRole('button', { name: 'Print / save as PDF' }));

    expect(print).toHaveBeenCalledTimes(1);
  });

  it('exports a versioned backup file', async () => {
    const user = userEvent.setup();
    const createObjectURL = vi.fn().mockReturnValue('blob:mock');
    const revokeObjectURL = vi.fn();
    Object.assign(URL, { createObjectURL, revokeObjectURL });

    seedStorage(completedDraft());
    await openSavedPlan(user);
    await user.click(screen.getByRole('button', { name: 'Download backup' }));

    expect(createObjectURL).toHaveBeenCalledTimes(1);
    expect(await screen.findByText('Backup downloaded.')).toBeInTheDocument();

    const blob: Blob = createObjectURL.mock.calls[0][0];
    const contents = JSON.parse(await blob.text());
    expect(contents.app).toBe('hagen-growth-mvo-planner');
    expect(contents.version).toBe(SCHEMA_VERSION);
    expect(contents.plan.priorities[0].name).toBe('Physical activity');
  });

  it('restores a backup after confirmation', async () => {
    const user = userEvent.setup();
    seedStorage(completedDraft('Relationships'));

    const backup = toBackup(completedDraft('A personal project'));
    const file = new File([JSON.stringify(backup)], 'mvo-plan.json', {
      type: 'application/json',
    });

    await openSavedPlan(user);
    expect(screen.getByRole('heading', { name: 'Relationships' })).toBeInTheDocument();

    await user.upload(screen.getByLabelText('Choose a backup file'), file);

    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveTextContent('This backup contains 1 priority.');
    await user.click(screen.getByRole('button', { name: 'Replace my plan' }));

    expect(
      await screen.findByRole('heading', { name: 'A personal project' }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Relationships' })).toBeNull();
  });

  it('keeps current work when a restore is cancelled', async () => {
    const user = userEvent.setup();
    seedStorage(completedDraft('Relationships'));
    const backup = toBackup(completedDraft('A personal project'));
    const file = new File([JSON.stringify(backup)], 'mvo-plan.json', {
      type: 'application/json',
    });

    await openSavedPlan(user);
    await user.upload(screen.getByLabelText('Choose a backup file'), file);
    await screen.findByRole('dialog');
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.getByRole('heading', { name: 'Relationships' })).toBeInTheDocument();
  });

  it('rejects an invalid backup file without replacing current work', async () => {
    const user = userEvent.setup();
    seedStorage(completedDraft('Relationships'));

    await openSavedPlan(user);

    // A .json file whose contents are not a plan at all.
    const junk = new File(['this is not json'], 'notes.json', {
      type: 'application/json',
    });
    await user.upload(screen.getByLabelText('Choose a backup file'), junk);

    expect(await screen.findByText(/isn’t a valid MVO Planner backup/)).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).toBeNull();
    // A structurally wrong but parseable file is rejected the same way.
    await user.upload(
      screen.getByLabelText('Choose a backup file'),
      new File([JSON.stringify({ hello: 'world' })], 'wrong.json', {
        type: 'application/json',
      }),
    );
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByRole('heading', { name: 'Relationships' })).toBeInTheDocument();
  });

  it('rejects a backup from a newer schema version', async () => {
    const user = userEvent.setup();
    seedStorage(completedDraft('Relationships'));
    await openSavedPlan(user);

    const future = new File(
      [JSON.stringify({ ...toBackup(completedDraft()), version: SCHEMA_VERSION + 1 })],
      'future.json',
      { type: 'application/json' },
    );
    await user.upload(screen.getByLabelText('Choose a backup file'), future);

    expect(
      await screen.findByText(/made by a newer version of the planner/),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Relationships' })).toBeInTheDocument();
  });
});
