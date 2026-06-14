import { format } from "date-fns";

export function formatCents(cents: number): string {
  return formatDollars(cents / 100);
}

export function formatDollars(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateRange(
  dateRange: { from?: Date; to?: Date } | undefined,
): string | null {
  if (!dateRange?.from) {
    return null;
  }

  const start = format(dateRange.from, "LLL dd, y");

  if (!dateRange.to) {
    return start;
  }

  return `${start} – ${format(dateRange.to, "LLL dd, y")}`;
}
