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
import { AddOn } from "generated/prisma/client";

function Timeline({ startDate, endDate }: { startDate: Date; endDate: Date }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <h4 className="mb-4 text-sm font-semibold text-slate-950">
        Trip timeline
      </h4>

      <div className="space-y-4">
        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Pick-up
          </span>
          <p className="mt-1 text-sm font-medium text-slate-950">
            {format(startDate, "PPpp")}
          </p>
        </div>

        <div className="h-px bg-slate-200" />

        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Drop-off
          </span>
          <p className="mt-1 text-sm font-medium text-slate-950">
            {format(endDate, "PPpp")}
          </p>
        </div>
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
      const addOn = addOns.find((item: AddOn) => item.id === addOnId);

      if (!addOn) return total;

      return total + addOn.total_price_cents;
    }, 0);
  }, [addOns, selectedAddOnIds]);

  const vehicle = getVehicleById(id);

  if (!id) {
    throw new Error("No vehicle ID found.");
  }

  if (vehicleLoading || addOnsLoading) {
    return (
      <div className="rounded-2xl border bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
        Loading reservation...
      </div>
    );
  }

  if (vehicleError) throw vehicleError;
  if (quoteError) throw quoteError;
  if (addOnsError) throw addOnsError;

  if (!vehicle) {
    return (
      <div className="rounded-2xl border border-dashed bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
        Vehicle not found.
      </div>
    );
  }

  if (!start || !end) {
    return (
      <div className="space-y-6">
        <VehicleDetails vehicle={vehicle} />
        <Separator />
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-950">
            Reservation Summary
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Pickup and drop-off times are required to see your quote.
          </p>
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
      return "Holiday Discount 17% OFF";
    }

    if (quote?.discountType === "MULTI_DAY") {
      return "Multi-day Discount $10/hr OFF";
    }

    return null;
  };

  const discountLabel = renderDiscountType();

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <VehicleDetails vehicle={vehicle} />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-950">
              Reservation Summary
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Review your rental details and choose any extras.
            </p>
          </div>

          <dl className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-sm text-slate-500">Hourly Rate</dt>
              <dd className="text-sm font-medium text-slate-950">
                {quote?.discountType === "MULTI_DAY" ? (
                  <>
                    <s className="mr-2 text-slate-400">
                      {formatCents(vehicle.hourly_rate_cents)}
                    </s>
                    <span>{formatCents(quote.hourlyRateCents)}</span>
                  </>
                ) : (
                  <span>{formatCents(vehicle.hourly_rate_cents)}</span>
                )}
                <span className="text-slate-500">/hr</span>
              </dd>
            </div>

            <div className="flex items-center justify-between gap-4">
              <dt className="text-sm text-slate-500">Duration</dt>
              <dd className="text-right text-sm font-medium text-slate-950">
                {formattedDuration}
              </dd>
            </div>

            <Separator />

            <div>
              <dt className="mb-3 text-sm font-medium text-slate-950">
                Optional Add-ons
              </dt>

              <dd className="space-y-3">
                {addOns?.map((addOn) => {
                  const quantity = selectedAddOnIds.filter(
                    (id) => id === addOn.id,
                  ).length;

                  const isSelected = quantity > 0;

                  return (
                    <div
                      key={addOn.id}
                      className="rounded-2xl border bg-slate-50 p-4"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-medium text-slate-950">
                            {addOn.name}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            {addOn.description}
                          </p>
                          <p className="mt-2 text-sm font-semibold text-slate-950">
                            {formatCents(addOn.total_price_cents)}
                          </p>
                        </div>

                        {addOn.billing_type === "PER_RENTAL" ? (
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemove(addOn.id)}
                              disabled={quantity === 0}
                            >
                              -
                            </Button>
                            <span className="w-6 text-center text-sm font-medium">
                              {quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAdd(addOn.id)}
                            >
                              +
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant={isSelected ? "secondary" : "outline"}
                            size="sm"
                            onClick={() => handleToggle(addOn.id)}
                          >
                            {isSelected ? "Remove" : "Add"}
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </dd>
            </div>

            {addOnsTotalCents > 0 && (
              <div className="flex items-center justify-between gap-4">
                <dt className="text-sm text-slate-500">Add-ons Total</dt>
                <dd className="text-sm font-medium text-slate-950">
                  {formatCents(addOnsTotalCents)}
                </dd>
              </div>
            )}

            <Separator />

            <div className="flex items-start justify-between gap-4">
              <dt className="text-base font-semibold text-slate-950">
                Total Cost
              </dt>
              <dd className="text-right">
                <p className="text-2xl font-semibold text-slate-950">
                  {totalCostContent}
                </p>

                {quote?.discountApplied && discountLabel && (
                  <p className="mt-2 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                    {discountLabel}
                  </p>
                )}
              </dd>
            </div>
          </dl>

          <Button
            onClick={handleConfirm}
            className="mt-6 w-full rounded-xl bg-slate-950 py-6 text-base font-medium text-white hover:bg-slate-800"
          >
            Confirm reservation
          </Button>
        </div>

        <Timeline startDate={startDate} endDate={endDate} />
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
