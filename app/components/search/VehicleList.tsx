import { useMemo, useState } from "react";
import { areIntervalsOverlapping, endOfDay, startOfDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { VehicleListItem } from "./VehicleListItem";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/shared/ui/popover";
import { Calendar } from "@/components/shared/ui/calendar";
import { Button } from "@/components/shared/ui/button";
import { formatDateRange } from "@/lib/formatters";
import type { Vehicle } from "@/server/data";
import type { VehicleWithReservations } from "@/server/data_helpers";

export function VehicleList({
  vehicles,
}: {
  vehicles: VehicleWithReservations[];
}) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const filteredVehicles = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) {
      return vehicles;
    }

    const rangeStart = startOfDay(dateRange.from);
    const rangeEnd = endOfDay(dateRange.to);

    return vehicles.filter((vehicle) => {
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
  }, [vehicles, dateRange]);

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
      </div>
      {filteredVehicles.length === 0 ? (
        <p>No vehicles found.</p>
      ) : (
        <ul>
          {filteredVehicles.map((vehicle) => (
            <VehicleListItem
              key={vehicle.id}
              vehicle={vehicle as unknown as Vehicle}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
