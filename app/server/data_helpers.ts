import { Reservation, RESERVATIONS, VEHICLES } from "./data";
import { prisma } from "../lib/prisma";
import type { Prisma } from "../../generated/prisma/browser";

export type VehicleWithReservations = Prisma.VehicleGetPayload<{
  include: { reservations: true };
}>;

export const getVehicleById = async (
  id: string,
): Promise<VehicleWithReservations | undefined> => {
  return prisma.vehicle.findUnique({
    where: { id: Number(id) },
    include: { reservations: true },
  });
};

export const getReservationById = (id: string): Reservation | undefined => {
  return RESERVATIONS.find((reservation) => reservation.id === id);
};

export const getVehicles = () => {
  return prisma.vehicle.findMany({
    include: { reservations: true },
  });
};
