import type { ReactNode } from 'react';
import { a11y } from '../../content/copy';

interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  optional?: boolean;
  error?: string;
  children: (props: {
    id: string;
    'aria-describedby': string | undefined;
    'aria-invalid': boolean | undefined;
  }) => ReactNode;
}

/**
 * A labelled control with its hint and error message kept adjacent and
 * wired up through aria-describedby.
 */
export function Field({ id, label, hint, optional, error, children }: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
        {optional ? (
          <span className="field__optional"> ({a11y.optionalSuffix})</span>
        ) : null}
      </label>
      {hint ? (
        <p className="field__hint" id={hintId}>
          {hint}
        </p>
      ) : null}
      {children({
        id,
        'aria-describedby': describedBy,
        'aria-invalid': error ? true : undefined,
      })}
      {error ? (
        <strong className="field__error" id={errorId}>
          {error}
        </strong>
      ) : null}
    </div>
  );
}
