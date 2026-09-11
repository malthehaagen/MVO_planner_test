/*
 * Dates are handled as local calendar dates (YYYY-MM-DD strings).
 * Nothing here uses Date.parse on a date-only string, which would be treated
 * as UTC and could shift the day depending on the time zone.
 */

export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function today(): string {
  return toISODate(new Date());
}

/** Returns a local calendar date `days` after today, as YYYY-MM-DD. */
export function daysFromToday(days: number): string {
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + days);
  return toISODate(target);
}

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isValidISODate(value: string): boolean {
  const match = ISO_DATE.exec(value);
  if (!match) return false;
  const [, y, m, d] = match;
  const year = Number(y);
  const month = Number(m);
  const day = Number(d);
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
  // Build as a local date and check the parts survive the round trip,
  // which rejects things like 2026-02-30.
  const parsed = new Date(year, month - 1, day);
  return (
    parsed.getFullYear() === year &&
    parsed.getMonth() === month - 1 &&
    parsed.getDate() === day
  );
}

/** Human-readable form of a local calendar date, e.g. "Friday 25 September 2026". */
export function formatDisplayDate(value: string): string {
  if (!isValidISODate(value)) return value;
  const [y, m, d] = value.split('-').map(Number);
  const local = new Date(y, m - 1, d);
  try {
    return new Intl.DateTimeFormat(undefined, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(local);
  } catch {
    return value;
  }
}
