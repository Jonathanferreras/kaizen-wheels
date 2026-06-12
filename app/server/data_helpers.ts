import { Reservation, RESERVATIONS, Vehicle, VEHICLES } from "./data";

export const getVehicleById = (id: string): Vehicle | undefined => {
  return VEHICLES.find((car) => car.id === id);
};

export const getReservationById = (id: string): Reservation | undefined => {
  return RESERVATIONS.find((reservation) => reservation.id === id);
};

export const getVehicles = () => {
  return VEHICLES;
};
