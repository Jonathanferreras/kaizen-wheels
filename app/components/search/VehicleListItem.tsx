import { useQuote } from "@/hooks/use-quote";
import { formatCents } from "@/lib/formatters";
import { Vehicle } from "@/server/data";
import { useBase64Image } from "@/util/useBase64Image";
import Link from "next/link";

export function VehicleListItem({
  vehicle,
  dates,
}: {
  vehicle: Vehicle;
  dates: { start?: Date; end?: Date };
}) {
  let totalCostContent;
  const imgData = useBase64Image(vehicle.thumbnail_url);
  const startDate = dates?.start?.toISOString();
  const endDate = dates?.end?.toISOString();

  const {
    quote,
    loading: quoteLoading,
    error: quoteError,
  } = useQuote({
    vehicleId: vehicle.id,
    startTime: startDate,
    endTime: endDate,
  });

  if (quoteError) {
    throw quoteError;
  }

  if (quoteLoading) {
    totalCostContent = "Loading quote...";
  } else if (quote) {
    totalCostContent = formatCents(quote.totalPriceCents);
  }

  const renderDiscountType = () => {
    if (quote?.discountType === "HOLIDAY") {
      return "Holiday Discount 17% OFF";
    }

    if (quote?.discountType === "MULTI_DAY") {
      return "Multi-day Discount $10/hr OFF";
    }

    return null;
  };

  const discountLabel = renderDiscountType();

  return (
    <li className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={imgData}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="space-y-4 p-4">
        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                {vehicle.make} {vehicle.model}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {vehicle.year} · {vehicle.classification}
              </p>
            </div>

            <div className="text-right">
              <p className="text-lg font-semibold text-slate-950">
                {quote?.discountType === "MULTI_DAY" ? (
                  <>
                    <s className="mr-2 text-sm font-normal text-slate-400">
                      {formatCents(vehicle.hourly_rate_cents)}
                    </s>
                    <span>{formatCents(quote.hourlyRateCents)}</span>
                  </>
                ) : (
                  <span>{formatCents(vehicle.hourly_rate_cents)}</span>
                )}
              </p>
              <p className="text-xs text-slate-500">/hr</p>
            </div>
          </div>

          {quote?.discountApplied && discountLabel && (
            <div className="mt-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              {discountLabel}
            </div>
          )}
        </div>

        <dl className="grid grid-cols-3 gap-3 rounded-xl bg-slate-50 p-3 text-sm">
          <div>
            <dt className="text-xs text-slate-500">Passengers</dt>
            <dd className="font-medium text-slate-900">
              {vehicle.max_passengers}
            </dd>
          </div>

          <div>
            <dt className="text-xs text-slate-500">Doors</dt>
            <dd className="font-medium text-slate-900">{vehicle.doors}</dd>
          </div>

          <div>
            <dt className="text-xs text-slate-500">Class</dt>
            <dd className="truncate font-medium text-slate-900">
              {vehicle.classification}
            </dd>
          </div>
        </dl>

        {dates.start && dates.end ? (
          <Link
            href={`/review?id=${vehicle.id}&start=${dates.start.toISOString()}&end=${dates.end.toISOString()}`}
            className="block rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Book now for {totalCostContent}
          </Link>
        ) : (
          <div className="rounded-xl border border-dashed px-4 py-3 text-center text-sm text-slate-500">
            Select dates for availability
          </div>
        )}
      </div>
    </li>
  );
}
