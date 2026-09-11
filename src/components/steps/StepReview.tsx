import { step5 } from '../../content/copy';
import type { Plan } from '../../types';
import { DateField, TextAreaField, TextField } from '../ui/TextField';
import { daysFromToday, today } from '../../lib/date';
import { errorFor, fieldIds, type FieldError } from '../../lib/validation';

interface Props {
  plan: Plan;
  errors: FieldError[];
  onChange: (plan: Plan) => void;
}

export function StepReview({ plan, errors, onChange }: Props) {
  const setDate = (value: string) => onChange({ ...plan, reviewDate: value });

  const shortcuts = [
    { label: step5.shortcutOneWeek, value: daysFromToday(7) },
    { label: step5.shortcutTwoWeeks, value: daysFromToday(14) },
  ];

  return (
    <div>
      <div className="step__header">
        <h2 className="heading">{step5.heading}</h2>
        <p className="muted">{step5.supporting}</p>
      </div>

      <DateField
        id={fieldIds.reviewDate}
        label={step5.reviewDateLabel}
        value={plan.reviewDate}
        min={today()}
        error={errorFor(errors, fieldIds.reviewDate)}
        onChange={setDate}
      />

      <div className="examples">
        <p className="examples__label" id="review-shortcuts-label">
          {step5.shortcutsLabel}
        </p>
        <ul className="chip-set" aria-labelledby="review-shortcuts-label">
          {shortcuts.map((shortcut) => (
            <li key={shortcut.value}>
              <button
                type="button"
                className="chip"
                aria-pressed={plan.reviewDate === shortcut.value}
                onClick={() => setDate(shortcut.value)}
              >
                {shortcut.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <hr className="divider" />

      <TextAreaField
        id={fieldIds.capacitySigns}
        label={step5.capacityLabel}
        placeholder={step5.capacityPlaceholder}
        rows={3}
        value={plan.capacitySigns}
        error={errorFor(errors, fieldIds.capacitySigns)}
        onChange={(value) => onChange({ ...plan, capacitySigns: value })}
      />

      <TextField
        id={fieldIds.firstStepBack}
        label={step5.firstStepLabel}
        placeholder={step5.firstStepPlaceholder}
        optional
        value={plan.firstStepBack}
        onChange={(value) => onChange({ ...plan, firstStepBack: value })}
      />
    </div>
  );
}
