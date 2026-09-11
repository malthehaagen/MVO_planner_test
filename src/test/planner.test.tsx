import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../App';
import { STORAGE_KEY } from '../lib/storage';

async function startPlanner(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: 'Build my plan' }));
}

async function fill(user: ReturnType<typeof userEvent.setup>, label: RegExp, value: string) {
  const field = screen.getByLabelText(label);
  await user.clear(field);
  await user.type(field, value);
}

async function continueStep(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: 'Continue' }));
}

describe('the planner', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('creates a plan with one priority', async () => {
    const user = userEvent.setup();
    render(<App />);

    await startPlanner(user);

    // Step 1
    await fill(user, /^Priority name$/, 'Physical activity');
    await fill(user, /Why does this matter to you\?/, 'It keeps me steady.');
    await continueStep(user);

    // Step 2
    await fill(user, /What does your usual commitment look like\?/, 'Three hour-long workouts each week.');
    await fill(user, /What is your minimum version\?/, 'A 20-minute session.');
    await fill(user, /How often will you do it\?/, 'Twice a week.');
    await fill(user, /When or where will it happen\?/, 'Tuesday and Saturday after work.');
    await continueStep(user);

    // Step 3
    expect(
      screen.getByRole('heading', { name: 'Does this fit your actual capacity?' }),
    ).toBeInTheDocument();
    await user.click(screen.getByLabelText('Yes, this feels manageable.'));
    await fill(user, /What are you deliberately setting aside\?/, 'Weekend long runs.');
    await continueStep(user);

    // Step 4
    await user.click(screen.getByLabelText('I need it now.'));
    await user.click(screen.getByRole('button', { name: 'I’m sacrificing rest to keep up.' }));
    await continueStep(user);

    // Step 5
    await user.click(screen.getByRole('button', { name: 'One week from today' }));
    await fill(user, /What would tell you that you have room to do more\?/, 'Two calm weeks in a row.');
    await user.click(screen.getByRole('button', { name: 'Create my MVO plan' }));

    const plan = await screen.findByRole('heading', {
      name: 'My minimum viable output plan',
    });
    expect(plan).toBeInTheDocument();
    expect(screen.getByText('A 20-minute session.')).toBeInTheDocument();
    expect(screen.getByText('Twice a week.')).toBeInTheDocument();
    expect(screen.getByText('Tuesday and Saturday after work.')).toBeInTheDocument();
    expect(screen.getByText('Weekend long runs.')).toBeInTheDocument();
    expect(screen.getByText('I’m sacrificing rest to keep up.')).toBeInTheDocument();
    expect(
      screen.getByText(
        'At your review, decide what still fits: keep the plan, reduce it further, or gradually build back up.',
      ),
    ).toBeInTheDocument();
  });

  it('requires at least one priority before continuing', async () => {
    const user = userEvent.setup();
    render(<App />);
    await startPlanner(user);
    await continueStep(user);

    // The message appears both in the summary at the top and beside the field.
    expect(
      await screen.findAllByText('Add at least one priority with a name.'),
    ).toHaveLength(2);
    expect(screen.getByRole('heading', { name: 'What do you want to maintain?' })).toBeInTheDocument();
  });

  it('handles three priorities including a paused one, and omits empty optional fields', async () => {
    const user = userEvent.setup();
    render(<App />);
    await startPlanner(user);

    await user.click(screen.getByRole('button', { name: 'Physical activity' }));
    await user.click(screen.getByRole('button', { name: 'Add another priority' }));
    await user.click(screen.getByRole('button', { name: 'A personal project' }));
    await user.click(screen.getByRole('button', { name: 'Add another priority' }));
    await user.click(screen.getByRole('button', { name: 'Learning' }));

    // The limit note replaces the add control at three priorities.
    expect(screen.queryByRole('button', { name: 'Add another priority' })).toBeNull();
    await continueStep(user);

    const activity = within(
      screen.getByRole('heading', { name: 'Physical activity' }).closest('section')!,
    );
    await user.type(
      activity.getByLabelText(/What does your usual commitment look like\?/),
      'Three workouts a week.',
    );
    await user.type(activity.getByLabelText(/What is your minimum version\?/), 'A short walk.');
    await user.type(activity.getByLabelText(/How often will you do it\?/), 'Most days.');

    const project = within(
      screen.getByRole('heading', { name: 'A personal project' }).closest('section')!,
    );
    await user.type(
      project.getByLabelText(/What does your usual commitment look like\?/),
      'Two evenings a week.',
    );
    await user.type(project.getByLabelText(/What is your minimum version\?/), 'Fifteen minutes.');
    await user.type(project.getByLabelText(/How often will you do it\?/), 'Once a week.');

    // Pause the third priority; its minimum-version fields disappear.
    const learning = within(
      screen.getByRole('heading', { name: 'Learning' }).closest('section')!,
    );
    await user.click(learning.getByLabelText('Pause this priority for now'));
    expect(learning.queryByLabelText(/What is your minimum version\?/)).toBeNull();
    await user.type(
      learning.getByLabelText(/What would help you reconsider this pause\?/),
      'A quieter month at work.',
    );

    await continueStep(user);
    await continueStep(user); // step 3 asks nothing required

    await user.click(screen.getByLabelText('I’m preparing for a demanding period.'));
    await fill(user, /What signs tell you it’s time to scale back\?/, 'Deadlines stack up.');
    await continueStep(user);

    await user.click(screen.getByRole('button', { name: 'Two weeks from today' }));
    await fill(user, /What would tell you that you have room to do more\?/, 'My evenings are free again.');
    await user.click(screen.getByRole('button', { name: 'Create my MVO plan' }));

    await screen.findByRole('heading', { name: 'My minimum viable output plan' });
    expect(screen.getByText('A demanding period I am preparing for.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Paused for now' })).toBeInTheDocument();
    expect(screen.getByText('A quieter month at work.')).toBeInTheDocument();
    // No reason was entered, and no "When or where" — those labels are absent.
    expect(screen.queryByText('Why it matters')).toBeNull();
    expect(screen.queryByText('When or where')).toBeNull();
    expect(screen.queryByText('First step back')).toBeNull();
  });

  it('keeps answers when navigating backwards', async () => {
    const user = userEvent.setup();
    render(<App />);
    await startPlanner(user);

    await fill(user, /^Priority name$/, 'Relationships');
    await continueStep(user);

    await fill(user, /What does your usual commitment look like\?/, 'A long call every Sunday.');
    await fill(user, /What is your minimum version\?/, 'A short message.');
    await fill(user, /How often will you do it\?/, 'Twice a week.');

    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByLabelText(/^Priority name$/)).toHaveValue('Relationships');

    await continueStep(user);
    expect(screen.getByLabelText(/What is your minimum version\?/)).toHaveValue(
      'A short message.',
    );
  });

  it('restores the draft after a refresh', async () => {
    const user = userEvent.setup();
    const first = render(<App />);
    await startPlanner(user);
    await fill(user, /^Priority name$/, 'Learning');

    await waitFor(() => {
      expect(window.localStorage.getItem(STORAGE_KEY)).toContain('Learning');
    });

    first.unmount();
    render(<App />); // a fresh load, as after a refresh

    expect(screen.getByText('You have a saved draft in this browser.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Continue my plan' }));
    expect(screen.getByLabelText(/^Priority name$/)).toHaveValue('Learning');
  });

  it('confirms before clearing saved work', async () => {
    const user = userEvent.setup();
    const first = render(<App />);
    await startPlanner(user);
    await fill(user, /^Priority name$/, 'Learning');
    await waitFor(() => {
      expect(window.localStorage.getItem(STORAGE_KEY)).toContain('Learning');
    });
    first.unmount();

    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Start again' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Keep my plan' }));
    expect(window.localStorage.getItem(STORAGE_KEY)).toContain('Learning');

    await user.click(screen.getByRole('button', { name: 'Start again' }));
    await user.click(screen.getByRole('button', { name: 'Yes, clear my plan' }));
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(screen.getByRole('button', { name: 'Build my plan' })).toBeInTheDocument();
  });

  it('renders typed input as text, never as markup', async () => {
    const user = userEvent.setup();
    render(<App />);
    await startPlanner(user);

    const hostile = '<img src=x onerror="alert(1)">';
    await fill(user, /^Priority name$/, hostile);
    await continueStep(user);

    // The heading shows the characters themselves; no element was created.
    expect(screen.getByRole('heading', { name: hostile })).toBeInTheDocument();
    expect(document.querySelector('img')).toBeNull();
  });

  it('keeps working when browser storage is unavailable', async () => {
    const user = userEvent.setup();
    const setItem = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('quota');
      });

    render(<App />);
    expect(
      screen.getByText(/This browser isn’t letting the planner save anything/),
    ).toBeInTheDocument();

    await startPlanner(user);
    await fill(user, /^Priority name$/, 'Relationships');
    expect(screen.getByLabelText(/^Priority name$/)).toHaveValue('Relationships');

    setItem.mockRestore();
  });
});
