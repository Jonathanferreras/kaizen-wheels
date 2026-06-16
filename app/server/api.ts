import { parseDateTimeParam } from "@/lib/dates";
import { DateTime } from "luxon";
import {
  AddonForReservation,
  getAddOnById,
  getAddOns,
  getReservationById,
  getVehicleById,
  getVehicles,
  VehicleWithReservations,
} from "./data_helpers";
import { Discounts, AddOns, HOLIDAYS } from "./data";

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
  addOns: AddOns[],
) => {
  const durationInHours = end.diff(start, "hours").hours || 0;
  const durationInDays = end.diff(start, "days").days;
  const hasHoliday = HOLIDAYS.some((h) => includesHoliday(h, start, end));
  const isMultiDay = durationInDays > 3;
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

  if (addOns.length > 0) {
    for (let addOn of addOns) {
      if (addOn.billing_type === "PER_DAY") {
        totalPriceCents += addOn.total_price_cents * durationInDays;
      } else if (addOn.billing_type === "PER_RENTAL") {
        totalPriceCents += addOn.total_price_cents;
      }
    }
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
  addOnIds?: string[];
}) => {
  const { vehicleId, startTime, endTime, addOnIds = [] } = input;
  const { start, end } = parseAndValidateTimeRange(startTime, endTime);
  const addOns = [];

  const vehicle = await getVehicleById(vehicleId);

  if (!vehicle) {
    throw new Error("NOT_FOUND: Vehicle not found");
  }

  for (let addOnId of addOnIds) {
    const addOn = await getAddOnById(addOnId);

    if (!addOn) {
      throw new Error("NOT_FOUND: AddOn not found");
    }

    addOns.push(addOn);
  }

  return { vehicle, start, end, addOns };
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

async function fetchAddOns() {
  let addOns: AddonForReservation[] = [];

  try {
    addOns = await getAddOns();

    if (!addOns) {
      throw new Error("NOT_FOUND: Add-ons not found");
    }
  } catch (error) {
    throw new Error(error);
  }

  return { addOns };
}

async function getQuote(input: {
  vehicleId: string;
  startTime: string;
  endTime: string;
  addOnIds?: string[];
}) {
  const {
    vehicle,
    start,
    end,
    addOns = [],
  } = await validateReservationAndGetVehicle(input);
  const totalPrice = calculateTotalPrice(
    start,
    end,
    vehicle.hourly_rate_cents,
    addOns,
  );

  return totalPrice;
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
  fetchAddOns,
};
