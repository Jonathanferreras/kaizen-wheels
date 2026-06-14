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
    <div>
      <div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
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
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <DollarSign className="mr-2 h-4 w-4" />
              {isPriceFilterActive ? (
                <>
                  {formatCents(minPrice)} – {formatCents(maxSelectedPrice)}/hr
                </>
              ) : (
                <span>Price</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
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
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" />
              <span>Passengers {passengerCount}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40" align="start">
            <Select
              value={String(passengerCount)}
              onValueChange={(value) => setPassengerCount(Number(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: maxPassengerCount }, (_, i) => i + 1).map(
                  (count) => (
                    <SelectItem key={count} value={String(count)}>
                      {count}
                    </SelectItem>
                  ),
                )}
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
      {filteredVehicles.length === 0 ? (
        <p>No vehicles found.</p>
      ) : (
        <ul>
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
