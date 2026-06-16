"use client";

import { VehicleDetails } from "@/components/review/VehicleDetails";
import { ErrorFallback } from "@/components/shared/ErrorFallback";
import { Button } from "@/components/shared/ui/button";
import { Separator } from "@/components/shared/ui/separator";
import { formatCents } from "@/lib/formatters";
import { format, formatDuration, intervalToDuration } from "date-fns";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { MiniPageLayout } from "../shared/MiniPageLayout";
import { useQuote } from "@/hooks/use-quote";
import { useVehicles } from "@/hooks/use-vehicles";
import { toIsoDateParam } from "@/lib/dates";
import { useAddOns } from "@/hooks/use-addOns";

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
  const startDate = new Date(start);
  const endDate = new Date(end);

  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);

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
  const { addOns, loading: addOnsLoading, error: addOnsError } = useAddOns();

  const addOnsTotalCents = useMemo(() => {
    if (!addOns) return 0;

    return selectedAddOnIds.reduce((total, addOnId) => {
      const addOn = addOns.find((item) => item.id === addOnId);

      if (!addOn) return total;

      return total + addOn.total_price_cents;
    }, 0);
  }, [addOns, selectedAddOnIds]);

  const vehicle = getVehicleById(id);

  if (!id) {
    throw new Error("No vehicle ID found.");
  }

  if (vehicleLoading || addOnsLoading) {
    return <div>Loading reservation...</div>;
  }

  if (vehicleError) {
    throw vehicleError;
  }

  if (quoteError) {
    throw quoteError;
  }

  if (addOnsError) {
    throw addOnsError;
  }

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

  const totalCostContent = quoteLoading
    ? "Loading quote..."
    : quote
      ? formatCents(quote.totalPriceCents + addOnsTotalCents)
      : null;

  const handleAdd = (addOnId: string) => {
    setSelectedAddOnIds((current) => [...current, addOnId]);
  };

  const handleRemove = (addOnId: string) => {
    setSelectedAddOnIds((current) => {
      const index = current.indexOf(addOnId);

      if (index === -1) {
        return current;
      }

      return current.filter((_, i) => i !== index);
    });
  };

  const handleToggle = (addOnId: string) => {
    setSelectedAddOnIds((current) =>
      current.includes(addOnId)
        ? current.filter((id) => id !== addOnId)
        : [...current, addOnId],
    );
  };

  const handleConfirm = () => {
    console.log({
      vehicleId: id,
      startTime: start,
      endTime: end,
      addOns: selectedAddOnIds,
    });
  };

  const formattedDuration = formatDuration(
    intervalToDuration({
      start: startDate,
      end: endDate,
    }),
    { delimiter: ", " },
  );

  const renderDiscountType = () => {
    if (quote?.discountType === "HOLIDAY") {
      return <span>Holiday Discount 17% OFF</span>;
    }

    if (quote?.discountType === "MULTI_DAY") {
      return <span>Multi-day Discount $10/hr OFF</span>;
    }

    return null;
  };

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
                      <s>{formatCents(vehicle.hourly_rate_cents)}</s>{" "}
                      <span>{formatCents(quote.hourlyRateCents)}</span>
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
              <dt>Optional Add-ons</dt>
              <dd>
                {addOns?.map((addOn) => {
                  const quantity = selectedAddOnIds.filter(
                    (id) => id === addOn.id,
                  ).length;

                  const isSelected = quantity > 0;

                  return (
                    <div key={addOn.id}>
                      <p>{addOn.name}</p>
                      <p>{addOn.description}</p>
                      <p>{formatCents(addOn.total_price_cents)}</p>

                      {addOn.billing_type === "PER_RENTAL" ? (
                        <>
                          <Button onClick={() => handleAdd(addOn.id)}>+</Button>
                          <span>{quantity}</span>
                          <Button
                            onClick={() => handleRemove(addOn.id)}
                            disabled={quantity === 0}
                          >
                            -
                          </Button>
                        </>
                      ) : (
                        <Button onClick={() => handleToggle(addOn.id)}>
                          {isSelected ? "Remove" : "Add"}
                        </Button>
                      )}
                    </div>
                  );
                })}
              </dd>
            </div>

            {addOnsTotalCents > 0 && (
              <div>
                <dt>Add-ons Total</dt>
                <dd>{formatCents(addOnsTotalCents)}</dd>
              </div>
            )}

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
