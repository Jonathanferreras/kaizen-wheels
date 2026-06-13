import { DateTime } from "luxon";
import {
  getReservationById,
  getVehicleById,
  getVehicles,
  VehicleWithReservations,
} from "./data_helpers";

const parseAndValidateTimeRange = (startTime: string, endTime: string) => {
  const start = DateTime.fromISO(startTime);
  const end = DateTime.fromISO(endTime);

  if (
    start.toString() === "Invalid Date" ||
    end.toString() === "Invalid Date"
  ) {
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

  return {
    totalPriceCents: hourlyRateCents * durationInHours,
    hourlyRateCents,
    durationInHours,
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

export const API = {
  searchVehicles,
  getVehicle,
  getReservation,
  getQuote,
};
