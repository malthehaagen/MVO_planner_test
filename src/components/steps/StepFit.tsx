import { plan as planCopy, step3 } from '../../content/copy';
import type { FitAnswer, Plan } from '../../types';
import { RadioCards } from '../ui/RadioCards';
import { TextAreaField } from '../ui/TextField';
import { fieldIds, type FieldError } from '../../lib/validation';

interface Props {
  plan: Plan;
  errors: FieldError[];
  onChange: (plan: Plan) => void;
  onAdjust: () => void;
}

export function StepFit({ plan, onChange, onAdjust }: Props) {
  const named = plan.priorities.filter((priority) => priority.name.trim() !== '');
  const needsAdjustment = plan.fit === 'unsure' || plan.fit === 'too-much';

  return (
    <div>
      <div className="step__header">
        <h2 className="heading">{step3.heading}</h2>
        <p className="muted">{step3.supporting}</p>
      </div>

      {named.length === 0 ? (
        <p className="note">{step3.noPriorities}</p>
      ) : (
        <ul className="fit-list">
          {named.map((priority) => (
            <li className="card" key={priority.id}>
              <div className="priority-card__head">
                <h3 className="fit-item__name">{priority.name}</h3>
                {priority.paused ? (
                  <span className="paused-flag">{step3.pausedLabel}</span>
                ) : null}
              </div>
              {priority.paused ? (
                priority.pauseReconsider.trim() ? (
                  <dl className="detail-list">
                    <dt>{planCopy.pauseReconsiderLabel}</dt>
                    <dd className="plan__free-text">{priority.pauseReconsider}</dd>
                  </dl>
                ) : null
              ) : (
                <dl className="detail-list">
                  {priority.usualCommitment.trim() ? (
                    <>
                      <dt>{planCopy.usualLabel}</dt>
                      <dd className="plan__free-text">{priority.usualCommitment}</dd>
                    </>
                  ) : null}
                  {priority.minimumVersion.trim() ? (
                    <>
                      <dt>{planCopy.minimumLabel}</dt>
                      <dd className="plan__free-text">{priority.minimumVersion}</dd>
                    </>
                  ) : null}
                  {priority.frequency.trim() ? (
                    <>
                      <dt>{planCopy.frequencyLabel}</dt>
                      <dd className="plan__free-text">{priority.frequency}</dd>
                    </>
                  ) : null}
                  {priority.timing.trim() ? (
                    <>
                      <dt>{planCopy.timingFieldLabel}</dt>
                      <dd className="plan__free-text">{priority.timing}</dd>
                    </>
                  ) : null}
                </dl>
              )}
            </li>
          ))}
        </ul>
      )}

      <hr className="divider" />

      <RadioCards
        id={fieldIds.planTiming + '-fit'}
        legend={step3.question}
        name="fit"
        options={step3.options}
        value={plan.fit}
        onChange={(value: FitAnswer) => onChange({ ...plan, fit: value })}
      />

      {needsAdjustment ? (
        <div className="note" role="status">
          <p>{step3.adjustPrompt}</p>
          <p style={{ marginTop: 'var(--space-3)' }}>
            <button
              type="button"
              className="button button--secondary button--small"
              onClick={onAdjust}
            >
              {step3.adjustAction}
            </button>
          </p>
        </div>
      ) : null}

      <hr className="divider" />

      <TextAreaField
        id={fieldIds.settingAside}
        label={step3.settingAsideLabel}
        hint={step3.settingAsideHint}
        placeholder={step3.settingAsidePlaceholder}
        optional
        value={plan.settingAside}
        onChange={(value) => onChange({ ...plan, settingAside: value })}
      />
    </div>
  );
}
