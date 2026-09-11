import { useEffect, useRef } from 'react';
import { a11y } from '../../content/copy';
import type { FieldError } from '../../lib/validation';

interface ErrorSummaryProps {
  errors: FieldError[];
  /** Changes whenever the person submits, so repeat submissions re-announce. */
  submitToken: number;
}

/** Lists validation problems and takes focus when they appear. */
export function ErrorSummary({ errors, submitToken }: ErrorSummaryProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (errors.length > 0) {
      ref.current?.focus();
    }
  }, [submitToken, errors.length]);

  if (errors.length === 0) return null;

  return (
    <div
      className="error-summary"
      ref={ref}
      tabIndex={-1}
      role="alert"
      aria-labelledby="error-summary-title"
    >
      <h2 id="error-summary-title">{a11y.errorSummaryTitle}</h2>
      <ul>
        {errors.map((error) => (
          <li key={`${error.fieldId}-${error.message}`}>
            <a
              href={`#${error.fieldId}`}
              onClick={(event) => {
                event.preventDefault();
                const target = document.getElementById(error.fieldId);
                target?.focus();
                target?.scrollIntoView({ block: 'center' });
              }}
            >
              {error.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
