import { plan as planCopy } from '../content/copy';
import { formatDisplayDate } from './date';
import type { Plan } from '../types';

const filled = (value: string) => value.trim().length > 0;

/**
 * A plain-text version of the finished plan, for the clipboard.
 * Optional fields the person left empty are omitted entirely, and their
 * own wording is preserved exactly.
 */
export function planToText(plan: Plan): string {
  const lines: string[] = [];
  const push = (line = '') => lines.push(line);

  push(planCopy.title);
  push('='.repeat(planCopy.title.length));
  push();

  if (plan.timing) {
    push(
      `${planCopy.timingLabel}: ${
        plan.timing === 'now' ? planCopy.timingNow : planCopy.timingFuture
      }`,
    );
    push();
  }

  if (filled(plan.signs)) {
    push(`${planCopy.signsLabel}:`);
    push(plan.signs.trim());
    push();
  }

  const active = plan.priorities.filter((p) => filled(p.name) && !p.paused);
  const paused = plan.priorities.filter((p) => filled(p.name) && p.paused);

  if (active.length > 0) {
    push(`${planCopy.prioritiesLabel}:`);
    push();
    active.forEach((priority) => {
      push(`- ${priority.name.trim()}`);
      if (filled(priority.reason)) {
        push(`  ${planCopy.reasonLabel}: ${priority.reason.trim()}`);
      }
      if (filled(priority.usualCommitment)) {
        push(`  ${planCopy.usualLabel}: ${priority.usualCommitment.trim()}`);
      }
      if (filled(priority.minimumVersion)) {
        push(`  ${planCopy.minimumLabel}: ${priority.minimumVersion.trim()}`);
      }
      if (filled(priority.frequency)) {
        push(`  ${planCopy.frequencyLabel}: ${priority.frequency.trim()}`);
      }
      if (filled(priority.timing)) {
        push(`  ${planCopy.timingFieldLabel}: ${priority.timing.trim()}`);
      }
      push();
    });
  }

  if (paused.length > 0) {
    push(`${planCopy.pausedLabel}:`);
    push();
    paused.forEach((priority) => {
      push(`- ${priority.name.trim()}`);
      if (filled(priority.reason)) {
        push(`  ${planCopy.reasonLabel}: ${priority.reason.trim()}`);
      }
      if (filled(priority.pauseReconsider)) {
        push(`  ${planCopy.pauseReconsiderLabel}: ${priority.pauseReconsider.trim()}`);
      }
      push();
    });
  }

  if (filled(plan.settingAside)) {
    push(`${planCopy.settingAsideLabel}:`);
    push(plan.settingAside.trim());
    push();
  }

  if (filled(plan.reviewDate)) {
    push(`${planCopy.reviewLabel}: ${formatDisplayDate(plan.reviewDate.trim())}`);
  }
  if (filled(plan.capacitySigns)) {
    push(`${planCopy.capacityLabel}: ${plan.capacitySigns.trim()}`);
  }
  if (filled(plan.firstStepBack)) {
    push(`${planCopy.firstStepLabel}: ${plan.firstStepBack.trim()}`);
  }

  push();
  push(planCopy.closing);

  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}
