import { prisma } from "../lib/prisma";
import type { Prisma } from "../../generated/prisma/browser";

export type VehicleWithReservations = Prisma.VehicleGetPayload<{
  include: { reservations: true };
}>;

export type VehicleReservation = Prisma.ReservationGetPayload<{
  include: { vehicle: true };
}>;

export type AddonForReservation = Prisma.AddOnGetPayload<{}>;

export const getVehicleById = async (
  id: string,
): Promise<VehicleWithReservations | undefined> => {
  return prisma.vehicle.findUnique({
    where: { id: Number(id) },
    include: { reservations: true },
  });
};

export const getReservationById = (
  id: string,
): Promise<VehicleReservation | undefined> => {
  return prisma.reservation.findUnique({
    where: { id },
    include: { vehicle: true },
  });
};

export const getVehicles = () => {
  return prisma.vehicle.findMany({
    include: { reservations: true },
  });
};

export const getAddOns = () => {
  return prisma.addOn.findMany();
};

export const getAddOnById = (
  id: string,
): Promise<AddonForReservation | undefined> => {
  return prisma.addOn.findUnique({
    where: { id },
  });
};
