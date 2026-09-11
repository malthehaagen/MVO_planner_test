interface Option<T extends string> {
  value: T;
  label: string;
  description?: string;
}

interface RadioCardsProps<T extends string> {
  /** Used as the fieldset id so validation can move focus here. */
  id: string;
  legend: string;
  name: string;
  options: ReadonlyArray<Option<T>>;
  value: T | '';
  onChange: (value: T) => void;
  error?: string;
  hint?: string;
  /** Hide the legend when a visible heading already asks the question. */
  legendHidden?: boolean;
}

/**
 * A group of choices rendered as cards. Native radio inputs keep arrow-key
 * navigation, screen reader semantics and form labelling intact.
 */
export function RadioCards<T extends string>({
  id,
  legend,
  name,
  options,
  value,
  onChange,
  error,
  hint,
  legendHidden = false,
}: RadioCardsProps<T>) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <fieldset
      className="field"
      id={id}
      tabIndex={-1}
      aria-describedby={describedBy}
      aria-invalid={error ? true : undefined}
      style={{ border: 0, padding: 0, margin: '0 0 var(--space-5)' }}
    >
      <legend
        className={legendHidden ? 'visually-hidden' : 'field__label'}
        style={{ padding: 0 }}
      >
        {legend}
      </legend>
      {hint ? (
        <p className="field__hint" id={hintId}>
          {hint}
        </p>
      ) : null}
      <div className="radio-group">
        {options.map((option) => (
          <label
            key={option.value}
            className="option-card"
            data-selected={value === option.value}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span>
              <span className="option-card__label">{option.label}</span>
              {option.description ? (
                <span className="option-card__description">{option.description}</span>
              ) : null}
            </span>
          </label>
        ))}
      </div>
      {error ? (
        <strong className="field__error" id={errorId}>
          {error}
        </strong>
      ) : null}
    </fieldset>
  );
}
