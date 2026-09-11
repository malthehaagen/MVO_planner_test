import { Field } from './Field';

interface BaseProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  placeholder?: string;
  optional?: boolean;
  error?: string;
}

export function TextField({
  id,
  label,
  value,
  onChange,
  hint,
  placeholder,
  optional,
  error,
}: BaseProps) {
  return (
    <Field id={id} label={label} hint={hint} optional={optional} error={error}>
      {(props) => (
        <input
          {...props}
          className="input"
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </Field>
  );
}

export function TextAreaField({
  id,
  label,
  value,
  onChange,
  hint,
  placeholder,
  optional,
  error,
  rows = 3,
}: BaseProps & { rows?: number }) {
  return (
    <Field id={id} label={label} hint={hint} optional={optional} error={error}>
      {(props) => (
        <textarea
          {...props}
          className="textarea"
          rows={rows}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </Field>
  );
}

export function DateField({
  id,
  label,
  value,
  onChange,
  hint,
  error,
  min,
}: BaseProps & { min?: string }) {
  return (
    <Field id={id} label={label} hint={hint} error={error}>
      {(props) => (
        <input
          {...props}
          className="input"
          type="date"
          value={value}
          min={min}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </Field>
  );
}
