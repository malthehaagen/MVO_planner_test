/*
 * Every piece of user-facing copy lives here.
 * Edit this file to change wording; no component hard-codes sentences.
 */

export const brand = {
  skipLink: 'Skip to content',
  wordmark: 'Hagen Growth',
  productName: 'The MVO Planner',
  headerTag: 'The MVO Planner',
  footer:
    'The MVO Planner by Hagen Growth. Everything you enter stays in this browser.',
};

export const storageNote =
  'Your plan is saved in this browser. It isn’t sent to Hagen Growth or synced across devices.';

export const storageUnavailableNote =
  'This browser isn’t letting the planner save anything, so your answers will be lost if you refresh or close the tab. You can still fill in the planner now — download a backup at the end to keep it.';

export const saveFailedNote =
  'The last change couldn’t be saved in this browser. Your answers are still here for now, but they may be lost if you refresh or close the tab. Download a backup from the finished plan to keep a copy.';

export const welcome = {
  title: 'Keep what matters within reach.',
  description:
    'When life asks more of you, your commitments may need to change. Create a smaller, realistic version of what matters, with a plan for reviewing it and returning.',
  definition:
    'Minimum viable output is the smallest commitment that meaningfully supports a priority during a demanding period.',
  primaryAction: 'Build my plan',
  continueAction: 'Continue my plan',
  restartAction: 'Start again',
  draftFound: 'You have a saved draft in this browser.',
  completedFound: 'You have a finished plan saved in this browser.',
  viewPlanAction: 'View my plan',
  disclosureSummary: 'Is this the right tool for me?',
  disclosureBody: [
    'This planner is for adapting commitments you already have, when your capacity is lower than usual — during illness, caregiving, a heavy stretch at work, or any period that asks more of you than normal.',
    'It isn’t a system for starting new habits, and it isn’t a challenge to keep everything going. Pausing a commitment is a valid choice, and this planner has a place for that.',
    'Essential needs come first. Sleep, food, medical care, and the people who depend on you are not commitments to reduce so that something else survives.',
  ],
};

export const confirmRestart = {
  title: 'Start again?',
  body: 'This clears the plan saved in this browser. It can’t be undone.',
  confirm: 'Yes, clear my plan',
  cancel: 'Keep my plan',
};

export const nav = {
  back: 'Back',
  continue: 'Continue',
  finish: 'Create my MVO plan',
  stepLabel: (current: number, total: number) => `Step ${current} of ${total}`,
};

export const steps = [
  { id: 1, shortTitle: 'Priorities' },
  { id: 2, shortTitle: 'Minimum versions' },
  { id: 3, shortTitle: 'Fit' },
  { id: 4, shortTitle: 'When to use it' },
  { id: 5, shortTitle: 'Review' },
] as const;

export const step1 = {
  heading: 'What do you want to maintain?',
  supporting:
    'Choose up to three priorities. Focus on what matters enough to keep some space for right now.',
  examplesLabel: 'Examples — select one to fill in a priority:',
  examples: [
    'Physical activity',
    'A personal project',
    'Relationships',
    'Learning',
  ],
  nameLabel: 'Priority name',
  namePlaceholder: 'For example: physical activity',
  reasonLabel: 'Why does this matter to you?',
  reasonPlaceholder: 'Optional',
  addPriority: 'Add another priority',
  removePriority: 'Remove',
  limitNote: 'You can plan for up to three priorities.',
  errorNoPriority: 'Add at least one priority with a name.',
  errorName: 'Enter a name for this priority.',
};

export const step2 = {
  heading: 'What can you realistically keep doing?',
  supporting:
    'Reduce the duration, frequency, or scope until the commitment fits. It should still meaningfully support the priority.',
  exampleTitle: 'An example',
  exampleRows: [
    ['Usual commitment', 'Three hour-long workouts each week.'],
    ['Minimum version', 'A 20-minute session.'],
    ['Frequency', 'Twice a week.'],
    ['When', 'Tuesday and Saturday after work.'],
  ] as ReadonlyArray<readonly [string, string]>,
  usualLabel: 'What does your usual commitment look like?',
  usualPlaceholder: 'For example: three hour-long workouts each week',
  minimumLabel: 'What is your minimum version?',
  minimumPlaceholder: 'For example: a 20-minute session',
  frequencyLabel: 'How often will you do it?',
  frequencyPlaceholder: 'For example: twice a week',
  frequencyExamplesLabel: 'Examples:',
  frequencyExamples: [
    'Twice a week',
    'Once a week',
    'Most weekday mornings',
    'Whenever I have a free evening',
  ],
  timingLabel: 'When or where will it happen?',
  timingPlaceholder: 'Optional — for example: Tuesday and Saturday after work',
  pauseLabel: 'Pause this priority for now',
  pauseHint:
    'Pausing means you are setting this aside for the period you’re planning for. It stays in your plan so you can pick it up again.',
  pauseReconsiderLabel: 'What would help you reconsider this pause?',
  pauseReconsiderPlaceholder: 'Optional',
  errorUsual: 'Describe your usual commitment.',
  errorMinimum: 'Describe your minimum version.',
  errorFrequency: 'Say how often you will do it.',
};

export const step3 = {
  heading: 'Does this fit your actual capacity?',
  supporting: 'Here is what you have written so far.',
  question: 'Could you maintain this during the kind of period you’re planning for?',
  options: [
    { value: 'manageable', label: 'Yes, this feels manageable.' },
    { value: 'unsure', label: 'I’m unsure.' },
    { value: 'too-much', label: 'It still feels like too much.' },
  ] as const,
  adjustPrompt:
    'Try reducing the duration, frequency, or scope. You can also pause a priority.',
  adjustAction: 'Adjust my commitments',
  settingAsideLabel: 'What are you deliberately setting aside?',
  settingAsideHint: 'Name anything you’re allowing yourself to pause or reduce.',
  settingAsidePlaceholder: 'Optional',
  pausedLabel: 'Paused for now',
  noPriorities: 'Go back to step one to add a priority.',
};

export const step4 = {
  heading: 'When will you use this plan?',
  timingOptions: [
    { value: 'now', label: 'I need it now.' },
    { value: 'preparing', label: 'I’m preparing for a demanding period.' },
  ] as const,
  signsLabelNow: 'What tells you it’s time to scale back?',
  signsLabelFuture: 'What signs tell you it’s time to scale back?',
  signsPlaceholder: 'Write in your own words, or start from an example below.',
  signsExamplesLabel: 'Examples — select one to add it, then edit it freely:',
  signsExamples: [
    'Work is taking more time than usual.',
    'My circumstances have changed.',
    'My usual commitments are repeatedly becoming unmanageable.',
    'I’m sacrificing rest to keep up.',
  ],
  errorTiming: 'Choose when you will use this plan.',
  errorSigns: 'Describe what tells you it’s time to scale back.',
};

export const step5 = {
  heading: 'When will you reassess?',
  supporting:
    'The review date is a check-in, not a deadline to return to full capacity. At the review you might keep the plan as it is, reduce it further, or gradually increase a commitment.',
  reviewDateLabel: 'Review date',
  shortcutsLabel: 'Shortcuts:',
  shortcutOneWeek: 'One week from today',
  shortcutTwoWeeks: 'Two weeks from today',
  capacityLabel: 'What would tell you that you have room to do more?',
  capacityPlaceholder:
    'For example: I have had two calm weeks and I’m sleeping normally again',
  firstStepLabel: 'What would your first step back look like?',
  firstStepPlaceholder: 'Optional — for example: add a third session back',
  errorReviewDate: 'Choose a review date.',
  errorReviewDateInvalid: 'Enter a valid date, such as 2026-09-30.',
  errorCapacity: 'Describe what would tell you that you have room to do more.',
};

export const plan = {
  title: 'My minimum viable output plan',
  timingLabel: 'This plan is for',
  timingNow: 'A demanding period I am in now.',
  timingFuture: 'A demanding period I am preparing for.',
  signsLabel: 'Signs it’s time to use this plan',
  prioritiesLabel: 'What I’m maintaining',
  pausedLabel: 'Paused for now',
  reasonLabel: 'Why it matters',
  usualLabel: 'Usual commitment',
  minimumLabel: 'Minimum version',
  frequencyLabel: 'How often',
  timingFieldLabel: 'When or where',
  pauseReconsiderLabel: 'What would help me reconsider',
  settingAsideLabel: 'What I’m setting aside',
  reviewSectionLabel: 'Review',
  reviewLabel: 'Review date',
  capacityLabel: 'Signs I have room to do more',
  firstStepLabel: 'First step back',
  closing:
    'At your review, decide what still fits: keep the plan, reduce it further, or gradually build back up.',
  savedNote: storageNote,
  actions: {
    edit: 'Edit my plan',
    copy: 'Copy plan',
    print: 'Print / save as PDF',
    download: 'Download backup',
    restart: 'Start again',
  },
  copySuccess: 'Plan copied to the clipboard.',
  copyFailure:
    'Copying didn’t work in this browser. Select the plan text above and copy it manually, or download a backup instead.',
  downloadSuccess: 'Backup downloaded.',
  downloadFailure:
    'The backup file couldn’t be created in this browser. Try the copy option instead.',
};

export const backup = {
  restoreAction: 'Restore backup',
  restoreHint:
    'Restoring replaces the plan currently in this browser with the contents of a backup file.',
  chooseFile: 'Choose a backup file',
  confirmTitle: 'Replace your current plan?',
  confirmBody: (count: number) =>
    `This backup contains ${count} ${count === 1 ? 'priority' : 'priorities'}. Restoring it replaces the plan currently in this browser.`,
  confirmAction: 'Replace my plan',
  cancelAction: 'Cancel',
  invalidFile:
    'That file isn’t a valid MVO Planner backup, so nothing was changed. Choose a file that was downloaded from this planner.',
  unsupportedVersion:
    'That backup was made by a newer version of the planner, so nothing was changed.',
  restored: 'Backup restored.',
};

export const preview = {
  title: 'Your plan so far',
  mobileSummary: 'Your plan so far',
  empty: 'Your answers will appear here as you fill them in.',
  untitledPriority: 'Untitled priority',
  pausedLabel: 'Paused for now',
  reviewLabel: 'Review',
  signsLabel: 'Signs to scale back',
  settingAsideLabel: 'Setting aside',
};

export const a11y = {
  errorSummaryTitle: 'Check these answers before continuing',
  optionalSuffix: 'optional',
  removePriorityLabel: (name: string) => `Remove priority: ${name}`,
  stepChanged: (current: number, total: number, heading: string) =>
    `Step ${current} of ${total}. ${heading}`,
};
