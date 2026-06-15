import { parseDateTimeParam } from "@/lib/dates";
import { DateTime } from "luxon";
import {
  getReservationById,
  getVehicleById,
  getVehicles,
  VehicleWithReservations,
} from "./data_helpers";
import { Discounts, HOLIDAYS } from "./data";

const parseAndValidateTimeRange = (startTime: string, endTime: string) => {
  const start = parseDateTimeParam(startTime);
  const end = parseDateTimeParam(endTime);

  if (!start || !end) {
    throw new Error(
      "BAD REQUEST: Invalid date format. Please use ISO 8601 format.",
    );
  }

  if (end <= start) {
    throw new Error("BAD REQUEST: end_time must be after start_time");
  }
  return { start, end };
};

const calculateTotalPrice = (
  start: DateTime,
  end: DateTime,
  hourlyRateCents: number,
) => {
  const durationInHours = end.diff(start, "hours").hours || 0;
  const hasHoliday = HOLIDAYS.some((h) => includesHoliday(h, start, end));
  const isMultiDay = end.diff(start, "days").days > 3;
  const baseCost = hourlyRateCents * durationInHours;
  const holidayCost = baseCost * 0.83;
  const multiDayCost = (hourlyRateCents - 1000) * durationInHours;
  let totalPriceCents = baseCost;
  let discountType: Discounts = "NONE";

  if (hasHoliday && isMultiDay) {
    totalPriceCents = Math.min(holidayCost, multiDayCost);
    discountType = holidayCost < multiDayCost ? "HOLIDAY" : "MULTI_DAY";
  } else if (isMultiDay) {
    totalPriceCents = multiDayCost;
    discountType = "MULTI_DAY";
    hourlyRateCents = hourlyRateCents - 1000;
  } else if (hasHoliday) {
    totalPriceCents = holidayCost;
    discountType = "HOLIDAY";
  }

  return {
    totalPriceCents,
    hourlyRateCents,
    durationInHours,
    discountType,
    discountApplied: discountType !== null,
  };
};

const validateReservationAndGetVehicle = async (input: {
  vehicleId: string;
  startTime: string;
  endTime: string;
}) => {
  const { vehicleId, startTime, endTime } = input;
  const { start, end } = parseAndValidateTimeRange(startTime, endTime);

  const vehicle = await getVehicleById(vehicleId);

  if (!vehicle) {
    throw new Error("NOT_FOUND: Vehicle not found");
  }

  return { vehicle, start, end };
};

async function searchVehicles(): Promise<{
  vehicles: VehicleWithReservations[];
}> {
  let vehicles: VehicleWithReservations[] = [];

  try {
    vehicles = await getVehicles();

    if (!vehicles) {
      throw new Error("NOT_FOUND: Vehicles not found");
    }
  } catch (error) {
    throw new Error(error);
  }

  return { vehicles };
}

async function getVehicle(id: string) {
  const vehicle = await getVehicleById(id);

  if (!vehicle) {
    throw new Error("NOT_FOUND: Vehicle not found");
  }

  return vehicle;
}

function getReservation(id: string) {
  const reservation = getReservationById(id);
  if (!reservation) {
    throw new Error("NOT_FOUND: Reservation not found");
  }
  return reservation;
}

async function getQuote(input: {
  vehicleId: string;
  startTime: string;
  endTime: string;
}) {
  const { vehicle, start, end } = await validateReservationAndGetVehicle(input);
  return calculateTotalPrice(start, end, vehicle.hourly_rate_cents);
}

function includesHoliday(
  holidayDate: string,
  startDate: DateTime,
  endDate: DateTime,
) {
  const holiday = DateTime.fromFormat(holidayDate, "LL/dd")
    .set({ year: startDate.year })
    .startOf("day");
  const startDay = startDate.startOf("day");
  const endDay = endDate.startOf("day");

  return holiday > startDay && holiday < endDay;
}

export const API = {
  searchVehicles,
  getVehicle,
  getReservation,
  getQuote,
};
