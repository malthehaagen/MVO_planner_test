import { step4 } from '../../content/copy';
import type { Plan, PlanTiming } from '../../types';
import { RadioCards } from '../ui/RadioCards';
import { TextAreaField } from '../ui/TextField';
import { ChipSet } from '../ui/ChipSet';
import { errorFor, fieldIds, type FieldError } from '../../lib/validation';

interface Props {
  plan: Plan;
  errors: FieldError[];
  onChange: (plan: Plan) => void;
}

export function StepWhen({ plan, errors, onChange }: Props) {
  // Someone already in a demanding period is asked in the present tense.
  const signsLabel =
    plan.timing === 'now' ? step4.signsLabelNow : step4.signsLabelFuture;

  const addExample = (example: string) => {
    const current = plan.signs.trim();
    const next = current.length === 0 ? example : `${current}\n${example}`;
    onChange({ ...plan, signs: next });
    window.requestAnimationFrame(() => {
      const field = document.getElementById(fieldIds.signs) as HTMLTextAreaElement | null;
      field?.focus();
      field?.setSelectionRange(next.length, next.length);
    });
  };

  const usedExamples = step4.signsExamples.filter((example) =>
    plan.signs.includes(example),
  );

  return (
    <div>
      <div className="step__header">
        <h2 className="heading">{step4.heading}</h2>
      </div>

      <RadioCards
        id={fieldIds.planTiming}
        legend={step4.heading}
        name="plan-timing"
        options={step4.timingOptions}
        value={plan.timing}
        onChange={(value: PlanTiming) => onChange({ ...plan, timing: value })}
        error={errorFor(errors, fieldIds.planTiming)}
        legendHidden
      />

      <hr className="divider" />

      <TextAreaField
        id={fieldIds.signs}
        label={signsLabel}
        placeholder={step4.signsPlaceholder}
        rows={4}
        value={plan.signs}
        error={errorFor(errors, fieldIds.signs)}
        onChange={(value) => onChange({ ...plan, signs: value })}
      />

      <ChipSet
        label={step4.signsExamplesLabel}
        items={step4.signsExamples}
        selected={usedExamples}
        onSelect={addExample}
      />
    </div>
  );
}
