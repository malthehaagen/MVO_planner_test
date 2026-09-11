import { useEffect, useRef, useState } from 'react';
import {
  a11y,
  nav,
  preview,
  step1,
  step2,
  step3,
  step4,
  step5,
  steps,
} from '../content/copy';
import type { Plan } from '../types';
import { validateStep, type FieldError } from '../lib/validation';
import { ErrorSummary } from './ui/ErrorSummary';
import { Progress } from './Progress';
import { PlanPreview, PlanPreviewDisclosure } from './PlanPreview';
import { StepPriorities } from './steps/StepPriorities';
import { StepMinimum } from './steps/StepMinimum';
import { StepFit } from './steps/StepFit';
import { StepWhen } from './steps/StepWhen';
import { StepReview } from './steps/StepReview';

interface PlannerProps {
  plan: Plan;
  step: number;
  onPlanChange: (plan: Plan) => void;
  onStepChange: (step: number) => void;
  onFinish: () => void;
  saveWarning?: string;
}

const TOTAL_STEPS = steps.length;

const STEP_HEADINGS = [
  step1.heading,
  step2.heading,
  step3.heading,
  step4.heading,
  step5.heading,
];

export function Planner({
  plan,
  step,
  onPlanChange,
  onStepChange,
  onFinish,
  saveWarning,
}: PlannerProps) {
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [submitToken, setSubmitToken] = useState(0);
  const headingRef = useRef<HTMLDivElement>(null);
  const previousStep = useRef(step);

  // Move focus to the top of the step whenever the step changes, so keyboard
  // and screen reader users start at the new content rather than the old one.
  useEffect(() => {
    if (previousStep.current !== step) {
      previousStep.current = step;
      headingRef.current?.focus();
    }
  }, [step]);

  const goTo = (next: number) => {
    setErrors([]);
    onStepChange(Math.min(Math.max(next, 1), TOTAL_STEPS));
  };

  const handleContinue = () => {
    const found = validateStep(step, plan);
    setErrors(found);
    setSubmitToken((token) => token + 1);
    if (found.length > 0) return;
    if (step === TOTAL_STEPS) {
      onFinish();
      return;
    }
    goTo(step + 1);
  };

  // Editing a field clears the message for that field as soon as it is fixed.
  const handlePlanChange = (next: Plan) => {
    onPlanChange(next);
    if (errors.length > 0) {
      setErrors(validateStep(step, next));
    }
  };

  const stepLabel = steps[step - 1].shortTitle;

  return (
    <div className="planner">
      <div className="planner__form">
        <p className="visually-hidden" role="status" aria-live="polite">
          {a11y.stepChanged(step, TOTAL_STEPS, STEP_HEADINGS[step - 1])}
        </p>

        <div ref={headingRef} tabIndex={-1} style={{ outline: 'none' }}>
          <Progress current={step} label={stepLabel} />
        </div>

        <PlanPreviewDisclosure plan={plan} />

        {saveWarning ? (
          <p className="note note--warning no-print" role="status">
            {saveWarning}
          </p>
        ) : null}

        <ErrorSummary errors={errors} submitToken={submitToken} />

        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleContinue();
          }}
          noValidate
        >
          {step === 1 ? (
            <StepPriorities plan={plan} errors={errors} onChange={handlePlanChange} />
          ) : null}
          {step === 2 ? (
            <StepMinimum plan={plan} errors={errors} onChange={handlePlanChange} />
          ) : null}
          {step === 3 ? (
            <StepFit
              plan={plan}
              errors={errors}
              onChange={handlePlanChange}
              onAdjust={() => goTo(2)}
            />
          ) : null}
          {step === 4 ? (
            <StepWhen plan={plan} errors={errors} onChange={handlePlanChange} />
          ) : null}
          {step === 5 ? (
            <StepReview plan={plan} errors={errors} onChange={handlePlanChange} />
          ) : null}

          <div className="step__actions no-print">
            {step > 1 ? (
              <button
                type="button"
                className="button button--secondary"
                onClick={() => goTo(step - 1)}
              >
                {nav.back}
              </button>
            ) : null}
            <button type="submit" className="button button--primary">
              {step === TOTAL_STEPS ? nav.finish : nav.continue}
            </button>
          </div>
        </form>
      </div>

      <aside className="planner__aside no-print" aria-label={preview.title}>
        <PlanPreview plan={plan} />
      </aside>
    </div>
  );
}
