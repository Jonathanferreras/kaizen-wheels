"use client";

import { VehicleDetails } from "@/components/review/VehicleDetails";
import { ErrorFallback } from "@/components/shared/ErrorFallback";
import { Button } from "@/components/shared/ui/button";
import { Separator } from "@/components/shared/ui/separator";
import { formatCents } from "@/lib/formatters";
import { format, formatDuration, intervalToDuration } from "date-fns";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { MiniPageLayout } from "../shared/MiniPageLayout";
import { useQuote } from "@/hooks/use-quote";
import { useVehicles } from "@/hooks/use-vehicles";
import { toIsoDateParam } from "@/lib/dates";

function Timeline({ startDate, endDate }: { startDate: Date; endDate: Date }) {
  return (
    <div>
      <div>
        <span>Pick-up</span>
        <p>{format(startDate, "PPpp")}</p>
      </div>
      <div>
        <p>Rental period</p>
      </div>
      <div>
        <span>Drop-off</span>
        <p>{format(endDate, "PPpp")}</p>
      </div>
    </div>
  );
}

function Content() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const start = toIsoDateParam(searchParams.get("start"));
  const end = toIsoDateParam(searchParams.get("end"));
  const {
    loading: vehicleLoading,
    error: vehicleError,
    getVehicleById,
  } = useVehicles();
  const {
    quote,
    loading: quoteLoading,
    error: quoteError,
  } = useQuote({
    vehicleId: id,
    startTime: start,
    endTime: end,
  });
  const vehicle = getVehicleById(id);
  const startDate = new Date(start);
  const endDate = new Date(end);
  let totalCostContent = null;

  if (!id) {
    throw new Error("No vehicle ID found.");
  }

  if (vehicleLoading) {
    return <div>Loading vehicle...</div>;
  }

  if (vehicleError) {
    throw vehicleError;
  }

  if (quoteError) {
    throw quoteError;
  }

  if (quoteLoading) {
    totalCostContent = "Loading quote...";
  } else if (quote) {
    totalCostContent = formatCents(quote.totalPriceCents);
  }

  const handleConfirm = () => {
    console.error("Not implemented");
  };

  const formattedDuration = formatDuration(
    intervalToDuration({
      start: startDate,
      end: endDate,
    }),
    { delimiter: ", " },
  );

  const renderDiscountType = () => {
    if (quote.discountType === "HOLIDAY") {
      return <span>Holiday Discount 17% OFF</span>;
    } else if (quote.discountType === "MULTI_DAY") {
      return <span>Multi-day Discount $10/hr OFF</span>;
    }
  };

  if (!vehicle) {
    return <div>Vehicle not found.</div>;
  }

  if (!start || !end) {
    return (
      <div>
        <VehicleDetails vehicle={vehicle} />
        <Separator />
        <div>
          <h3>Reservation Summary</h3>
          <p>Pickup and drop-off times are required to see your quote.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <VehicleDetails vehicle={vehicle} />
      <Separator />
      <div>
        <h3>Reservation Summary</h3>
        <div>
          <dl>
            <div>
              <dt>Hourly Rate</dt>
              <dd>
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
              </dd>
            </div>
            <div>
              <dt>Duration</dt>
              <dd>{formattedDuration}</dd>
            </div>
            <div>
              <dt>Total Cost</dt>
              <dd>
                {totalCostContent}{" "}
                {quote?.discountApplied && renderDiscountType()}
              </dd>
            </div>
          </dl>
          <Timeline startDate={startDate} endDate={endDate} />
        </div>
        <Button onClick={handleConfirm}>Confirm reservation</Button>
      </div>
    </div>
  );
}

export function ReviewPage() {
  return (
    <MiniPageLayout
      title="Almost there"
      subtitle="Your adventure is about to begin! Please confirm your reservation below."
    >
      <ErrorBoundary
        fallback={<ErrorFallback message="Failed to load reservation" />}
      >
        <Suspense fallback={null}>
          <Content />
        </Suspense>
      </ErrorBoundary>
    </MiniPageLayout>
  );
}
