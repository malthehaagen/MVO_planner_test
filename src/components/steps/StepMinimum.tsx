import { step2, step3 } from '../../content/copy';
import type { Plan, Priority } from '../../types';
import { TextField, TextAreaField } from '../ui/TextField';
import { ChipSet } from '../ui/ChipSet';
import { errorFor, fieldIds, type FieldError } from '../../lib/validation';

interface Props {
  plan: Plan;
  errors: FieldError[];
  onChange: (plan: Plan) => void;
}

export function StepMinimum({ plan, errors, onChange }: Props) {
  const named = plan.priorities.filter((priority) => priority.name.trim() !== '');

  const update = (id: string, patch: Partial<Priority>) => {
    onChange({
      ...plan,
      priorities: plan.priorities.map((priority) =>
        priority.id === id ? { ...priority, ...patch } : priority,
      ),
    });
  };

  return (
    <div>
      <div className="step__header">
        <h2 className="heading">{step2.heading}</h2>
        <p className="muted">{step2.supporting}</p>
      </div>

      <details className="disclosure no-print">
        <summary className="disclosure__summary">{step2.exampleTitle}</summary>
        <div className="disclosure__body">
          <dl className="detail-list">
            {step2.exampleRows.map(([label, value]) => (
              <div key={label} style={{ display: 'contents' }}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </details>

      <hr className="divider" />

      {named.map((priority) => (
        <section className="card priority-card" key={priority.id}>
          <div className="priority-card__head">
            <h3 className="priority-card__title">{priority.name}</h3>
            {priority.paused ? (
              <span className="paused-flag">{step3.pausedLabel}</span>
            ) : null}
          </div>

          <div>
            <label className="checkbox" htmlFor={`${priority.id}-pause`}>
              <input
                id={`${priority.id}-pause`}
                type="checkbox"
                aria-describedby={`${priority.id}-pause-hint`}
                checked={priority.paused}
                onChange={(event) =>
                  update(priority.id, { paused: event.target.checked })
                }
              />
              <span className="option-card__label">{step2.pauseLabel}</span>
            </label>
            <p className="field__hint" id={`${priority.id}-pause-hint`}>
              {step2.pauseHint}
            </p>
          </div>

          <hr className="divider" />

          {priority.paused ? (
            <TextAreaField
              id={fieldIds.priorityPauseReconsider(priority.id)}
              label={step2.pauseReconsiderLabel}
              placeholder={step2.pauseReconsiderPlaceholder}
              optional
              value={priority.pauseReconsider}
              onChange={(value) => update(priority.id, { pauseReconsider: value })}
            />
          ) : (
            <>
              <TextAreaField
                id={fieldIds.priorityUsual(priority.id)}
                label={step2.usualLabel}
                placeholder={step2.usualPlaceholder}
                rows={2}
                value={priority.usualCommitment}
                error={errorFor(errors, fieldIds.priorityUsual(priority.id))}
                onChange={(value) => update(priority.id, { usualCommitment: value })}
              />

              <TextAreaField
                id={fieldIds.priorityMinimum(priority.id)}
                label={step2.minimumLabel}
                placeholder={step2.minimumPlaceholder}
                rows={2}
                value={priority.minimumVersion}
                error={errorFor(errors, fieldIds.priorityMinimum(priority.id))}
                onChange={(value) => update(priority.id, { minimumVersion: value })}
              />

              <TextField
                id={fieldIds.priorityFrequency(priority.id)}
                label={step2.frequencyLabel}
                placeholder={step2.frequencyPlaceholder}
                value={priority.frequency}
                error={errorFor(errors, fieldIds.priorityFrequency(priority.id))}
                onChange={(value) => update(priority.id, { frequency: value })}
              />

              <ChipSet
                label={step2.frequencyExamplesLabel}
                items={step2.frequencyExamples}
                selected={[priority.frequency.trim()]}
                onSelect={(value) => {
                  update(priority.id, { frequency: value });
                  window.requestAnimationFrame(() => {
                    document
                      .getElementById(fieldIds.priorityFrequency(priority.id))
                      ?.focus();
                  });
                }}
              />

              <TextField
                id={fieldIds.priorityTiming(priority.id)}
                label={step2.timingLabel}
                placeholder={step2.timingPlaceholder}
                optional
                value={priority.timing}
                onChange={(value) => update(priority.id, { timing: value })}
              />
            </>
          )}
        </section>
      ))}
    </div>
  );
}
