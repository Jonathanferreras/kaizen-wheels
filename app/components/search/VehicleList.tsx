import { useMemo, useState } from "react";
import { areIntervalsOverlapping, endOfDay, startOfDay } from "date-fns";
import { Calendar as CalendarIcon, DollarSign, Users } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { VehicleListItem } from "./VehicleListItem";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/shared/ui/popover";
import { Calendar } from "@/components/shared/ui/calendar";
import { Button } from "@/components/shared/ui/button";
import { RangeSlider } from "@/components/shared/ui/slider";
import { formatCents, formatDateRange } from "@/lib/formatters";
import type { Vehicle } from "@/server/data";
import type { VehicleWithReservations } from "@/server/data_helpers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shared/ui/select";

export function VehicleList({
  vehicles,
}: {
  vehicles: VehicleWithReservations[];
}) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [priceRange, setPriceRange] = useState<[number, number]>();
  const [passengerCount, setPassengerCount] = useState<number>(2);

  const maxPrice = useMemo(
    () => Math.max(0, ...vehicles.map((v) => v.hourly_rate_cents)),
    [vehicles],
  );

  const [minPrice, maxSelectedPrice] = priceRange ?? [0, maxPrice];
  const isPriceFilterActive = minPrice > 0 || maxSelectedPrice < maxPrice;

  const maxPassengerCount = useMemo(
    () => Math.max(0, ...vehicles.map((v) => v.max_passengers)),
    [vehicles],
  );

  const filteredVehicles = useMemo(() => {
    let result = vehicles;

    if (isPriceFilterActive) {
      result = result.filter(
        (v) =>
          v.hourly_rate_cents >= minPrice &&
          v.hourly_rate_cents <= maxSelectedPrice,
      );
    }

    if (dateRange?.from && dateRange?.to) {
      const rangeStart = startOfDay(dateRange.from);
      const rangeEnd = endOfDay(dateRange.to);

      result = result.filter((vehicle) => {
        return !vehicle.reservations.some((reservation) =>
          areIntervalsOverlapping(
            {
              start: new Date(reservation.start_time),
              end: new Date(reservation.end_time),
            },
            { start: rangeStart, end: rangeEnd },
          ),
        );
      });
    }

    result = result.filter(
      (vehicle) => passengerCount <= vehicle.max_passengers,
    );

    return result;
  }, [
    vehicles,
    dateRange,
    minPrice,
    maxSelectedPrice,
    isPriceFilterActive,
    passengerCount,
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-950">
            Find your ride
          </h2>
          <p className="text-sm text-slate-500">
            Filter by dates, price, and passenger capacity.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start sm:w-auto"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formatDateRange(dateRange) ?? <span>Pick dates</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            {dateRange?.from && (
              <Button variant="ghost" onClick={() => setDateRange(undefined)}>
                Clear
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start sm:w-auto"
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  {isPriceFilterActive ? (
                    <>
                      {formatCents(minPrice)} – {formatCents(maxSelectedPrice)}
                      /hr
                    </>
                  ) : (
                    <span>Price</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-5" align="start">
                <div className="mb-4 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">
                    Hourly price
                  </span>
                  <span className="text-slate-500">
                    {formatCents(minPrice)} – {formatCents(maxSelectedPrice)}
                  </span>
                </div>

                <RangeSlider
                  min={0}
                  max={maxPrice}
                  step={100}
                  value={[minPrice, maxSelectedPrice]}
                  onValueChange={(value) => setPriceRange([value[0], value[1]])}
                />
              </PopoverContent>
            </Popover>

            {isPriceFilterActive && (
              <Button variant="ghost" onClick={() => setPriceRange(undefined)}>
                Clear
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start sm:w-auto"
                >
                  <Users className="mr-2 h-4 w-4" />
                  <span>Passengers {passengerCount}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-44 p-4" align="start">
                <Select
                  value={String(passengerCount)}
                  onValueChange={(value) => setPassengerCount(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from(
                      { length: maxPassengerCount },
                      (_, i) => i + 1,
                    ).map((count) => (
                      <SelectItem key={count} value={String(count)}>
                        {count}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </PopoverContent>
            </Popover>

            {passengerCount !== 2 && (
              <Button variant="ghost" onClick={() => setPassengerCount(2)}>
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-medium text-slate-900">
            {filteredVehicles.length}
          </span>{" "}
          {filteredVehicles.length === 1 ? "vehicle" : "vehicles"}
        </p>
      </div>

      {filteredVehicles.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-white p-10 text-center shadow-sm">
          <p className="text-base font-medium text-slate-900">
            No vehicles found
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Try adjusting your dates, price, or passenger count.
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredVehicles.map((vehicle) => (
            <VehicleListItem
              key={vehicle.id}
              vehicle={vehicle as unknown as Vehicle}
              dates={{ start: dateRange?.from, end: dateRange?.to }}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
