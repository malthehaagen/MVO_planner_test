import { MAX_PRIORITIES, createPriority, type Plan, type Priority } from '../../types';
import { a11y, step1 } from '../../content/copy';
import { TextField, TextAreaField } from '../ui/TextField';
import { ChipSet } from '../ui/ChipSet';
import { errorFor, fieldIds, type FieldError } from '../../lib/validation';

interface Props {
  plan: Plan;
  errors: FieldError[];
  onChange: (plan: Plan) => void;
}

export function StepPriorities({ plan, errors, onChange }: Props) {
  const update = (id: string, patch: Partial<Priority>) => {
    onChange({
      ...plan,
      priorities: plan.priorities.map((priority) =>
        priority.id === id ? { ...priority, ...patch } : priority,
      ),
    });
  };

  const addPriority = () => {
    if (plan.priorities.length >= MAX_PRIORITIES) return;
    onChange({ ...plan, priorities: [...plan.priorities, createPriority()] });
  };

  const removePriority = (id: string) => {
    const remaining = plan.priorities.filter((priority) => priority.id !== id);
    onChange({
      ...plan,
      priorities: remaining.length > 0 ? remaining : [createPriority()],
    });
  };

  /** Fills the first empty priority name, or adds one if there is room. */
  const useExample = (example: string) => {
    const emptySlot = plan.priorities.find((priority) => priority.name.trim() === '');
    if (emptySlot) {
      update(emptySlot.id, { name: example });
      window.requestAnimationFrame(() => {
        document.getElementById(fieldIds.priorityName(emptySlot.id))?.focus();
      });
      return;
    }
    if (plan.priorities.length >= MAX_PRIORITIES) return;
    const next = createPriority({ name: example });
    onChange({ ...plan, priorities: [...plan.priorities, next] });
    window.requestAnimationFrame(() => {
      document.getElementById(fieldIds.priorityName(next.id))?.focus();
    });
  };

  const chosen = plan.priorities.map((priority) => priority.name.trim());
  const atLimit = plan.priorities.length >= MAX_PRIORITIES;

  return (
    <div>
      <div className="step__header">
        <h2 className="heading">{step1.heading}</h2>
        <p className="muted">{step1.supporting}</p>
      </div>

      <ChipSet
        label={step1.examplesLabel}
        items={step1.examples}
        selected={chosen}
        onSelect={useExample}
      />

      <div id={fieldIds.prioritiesGroup}>
        {plan.priorities.map((priority, index) => (
          <section className="card priority-card" key={priority.id}>
            <div className="priority-card__head">
              <h3 className="priority-card__index">Priority {index + 1}</h3>
              {plan.priorities.length > 1 ? (
                <button
                  type="button"
                  className="button button--quiet button--small"
                  aria-label={a11y.removePriorityLabel(
                    priority.name.trim() || `${index + 1}`,
                  )}
                  onClick={() => removePriority(priority.id)}
                >
                  {step1.removePriority}
                </button>
              ) : null}
            </div>

            <TextField
              id={fieldIds.priorityName(priority.id)}
              label={step1.nameLabel}
              placeholder={step1.namePlaceholder}
              value={priority.name}
              error={errorFor(errors, fieldIds.priorityName(priority.id))}
              onChange={(value) => update(priority.id, { name: value })}
            />

            <TextAreaField
              id={fieldIds.priorityReason(priority.id)}
              label={step1.reasonLabel}
              placeholder={step1.reasonPlaceholder}
              optional
              value={priority.reason}
              onChange={(value) => update(priority.id, { reason: value })}
            />
          </section>
        ))}
      </div>

      {atLimit ? (
        <p className="muted">{step1.limitNote}</p>
      ) : (
        <button type="button" className="button button--secondary" onClick={addPriority}>
          {step1.addPriority}
        </button>
      )}
    </div>
  );
}
