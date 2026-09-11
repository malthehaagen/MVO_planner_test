import { step1, step2, step4, step5 } from '../content/copy';
import { isValidISODate } from './date';
import type { Plan } from '../types';

export interface FieldError {
  /** DOM id of the control the message belongs to. */
  fieldId: string;
  message: string;
}

export const fieldIds = {
  priorityName: (id: string) => `priority-${id}-name`,
  priorityReason: (id: string) => `priority-${id}-reason`,
  priorityUsual: (id: string) => `priority-${id}-usual`,
  priorityMinimum: (id: string) => `priority-${id}-minimum`,
  priorityFrequency: (id: string) => `priority-${id}-frequency`,
  priorityTiming: (id: string) => `priority-${id}-timing`,
  priorityPauseReconsider: (id: string) => `priority-${id}-pause-reconsider`,
  prioritiesGroup: 'priorities-group',
  settingAside: 'setting-aside',
  planTiming: 'plan-timing',
  signs: 'signs',
  reviewDate: 'review-date',
  capacitySigns: 'capacity-signs',
  firstStepBack: 'first-step-back',
};

const blank = (value: string) => value.trim().length === 0;

export function validateStep(step: number, plan: Plan): FieldError[] {
  const errors: FieldError[] = [];

  if (step === 1) {
    const named = plan.priorities.filter((p) => !blank(p.name));
    if (named.length === 0) {
      const first = plan.priorities[0];
      errors.push({
        fieldId: first ? fieldIds.priorityName(first.id) : fieldIds.prioritiesGroup,
        message: step1.errorNoPriority,
      });
    }
    // A priority that has a reason but no name is almost certainly unfinished.
    plan.priorities.forEach((priority) => {
      if (blank(priority.name) && !blank(priority.reason)) {
        errors.push({
          fieldId: fieldIds.priorityName(priority.id),
          message: step1.errorName,
        });
      }
    });
  }

  if (step === 2) {
    plan.priorities.forEach((priority) => {
      if (blank(priority.name) || priority.paused) return;
      if (blank(priority.usualCommitment)) {
        errors.push({
          fieldId: fieldIds.priorityUsual(priority.id),
          message: step2.errorUsual,
        });
      }
      if (blank(priority.minimumVersion)) {
        errors.push({
          fieldId: fieldIds.priorityMinimum(priority.id),
          message: step2.errorMinimum,
        });
      }
      if (blank(priority.frequency)) {
        errors.push({
          fieldId: fieldIds.priorityFrequency(priority.id),
          message: step2.errorFrequency,
        });
      }
    });
  }

  // Step 3 has no required answers: the fit question is a prompt to reflect,
  // not a gate, and there is no score.

  if (step === 4) {
    if (plan.timing === '') {
      errors.push({ fieldId: fieldIds.planTiming, message: step4.errorTiming });
    }
    if (blank(plan.signs)) {
      errors.push({ fieldId: fieldIds.signs, message: step4.errorSigns });
    }
  }

  if (step === 5) {
    if (blank(plan.reviewDate)) {
      errors.push({ fieldId: fieldIds.reviewDate, message: step5.errorReviewDate });
    } else if (!isValidISODate(plan.reviewDate)) {
      errors.push({
        fieldId: fieldIds.reviewDate,
        message: step5.errorReviewDateInvalid,
      });
    }
    if (blank(plan.capacitySigns)) {
      errors.push({
        fieldId: fieldIds.capacitySigns,
        message: step5.errorCapacity,
      });
    }
  }

  return errors;
}

export function errorFor(errors: FieldError[], fieldId: string): string | undefined {
  return errors.find((error) => error.fieldId === fieldId)?.message;
}
