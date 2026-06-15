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
  dates: { start: Date; end: Date };
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
    totalCostContent = formatCents(quote?.totalPriceCents);
  }

  const renderDiscountType = () => {
    if (quote.discountType === "HOLIDAY") {
      return <span>Holiday Discount 17% OFF</span>;
    } else if (quote.discountType === "MULTI_DAY") {
      return <span>Multi-day Discount $10/hr OFF</span>;
    }
  };

  return (
    <li>
      <div>
        <img src={imgData} alt={`${vehicle.make} ${vehicle.model}`} />
      </div>
      <div>
        <h2>
          {vehicle.make} {vehicle.model}
        </h2>
        <dl>
          <div>
            <dt>Year</dt>
            <dd>{vehicle.year}</dd>
          </div>
          <div>
            <dt>Class</dt>
            <dd>{vehicle.classification}</dd>
          </div>
          <div>
            <dt>Passengers</dt>
            <dd>{vehicle.max_passengers}</dd>
          </div>
          <div>
            <dt>Doors</dt>
            <dd>{vehicle.doors}</dd>
          </div>
        </dl>
      </div>
      <div>
        <p>
          {quote?.discountType === "MULTI_DAY" ? (
            <>
              <s>{formatCents(vehicle.hourly_rate_cents)}</s>
              <span>{formatCents(quote?.hourlyRateCents)}</span>
            </>
          ) : (
            <span>{formatCents(vehicle.hourly_rate_cents)}</span>
          )}
          <span>/hr</span>
        </p>
        {dates.start && dates.end ? (
          <Link
            href={`/review?id=${vehicle.id}&start=${dates.start.toISOString()}&end=${dates.end.toISOString()}`}
          >
            <p>
              Book now for {totalCostContent}{" "}
              {quote?.discountApplied && renderDiscountType()}
            </p>
          </Link>
        ) : (
          <span>Select dates for availability</span>
        )}
      </div>
    </li>
  );
}
