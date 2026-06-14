import { DateTime } from "luxon";

export function parseDateTimeParam(value: string): DateTime | null {
  const iso = DateTime.fromISO(value, { setZone: true });
  if (iso.isValid) {
    return iso;
  }

  const jsDate = new Date(value);
  if (!Number.isNaN(jsDate.getTime())) {
    const fromJs = DateTime.fromJSDate(jsDate);
    if (fromJs.isValid) {
      return fromJs;
    }
  }

  return null;
}

export function toIsoDateParam(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  return parseDateTimeParam(value)?.toISO() ?? null;
}
