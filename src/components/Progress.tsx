import { nav, steps } from '../content/copy';

interface ProgressProps {
  current: number;
  label: string;
}

export function Progress({ current, label }: ProgressProps) {
  const total = steps.length;
  return (
    <div className="progress">
      <div className="progress__meta">
        <span>{nav.stepLabel(current, total)}</span>
        <span>{label}</span>
      </div>
      <div
        className="progress__track"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-valuetext={`${nav.stepLabel(current, total)}: ${label}`}
      >
        {steps.map((step) => (
          <span
            key={step.id}
            className={[
              'progress__segment',
              step.id < current ? 'progress__segment--done' : '',
              step.id === current ? 'progress__segment--current' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          />
        ))}
      </div>
    </div>
  );
}
