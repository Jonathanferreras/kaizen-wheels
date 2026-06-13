import { prisma } from "../../app/lib/prisma";
import { VEHICLES, RESERVATIONS } from "../../app/server/data";

async function main() {
  if ((await prisma.vehicle.count()) === 0) {
    for (const vehicle of VEHICLES) {
      await prisma.vehicle.create({
        data: {
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          doors: vehicle.doors,
          max_passengers: vehicle.max_passengers,
          classification: vehicle.classification,
          thumbnail_url: vehicle.thumbnail_url,
          hourly_rate_cents: vehicle.hourly_rate_cents,
        },
      });
    }

    const allVehicles = await prisma.vehicle.findMany({
      include: {
        reservations: true,
      },
    });
    console.log("All vehicles:", JSON.stringify(allVehicles, null, 2));
  } else {
    console.log("Vehicles already seeded");
  }

  if ((await prisma.reservation.count()) === 0) {
    for (const reservation of RESERVATIONS) {
      await prisma.reservation.create({
        data: {
          vehicle_id: parseInt(reservation.vehicle_id),
          start_time: reservation.start_time.toJSDate(),
          end_time: reservation.end_time.toJSDate(),
          total_price_cents: reservation.total_price_cents,
        },
      });
    }

    const allReservations = await prisma.reservation.findMany({
      include: {
        vehicle: true,
      },
    });
    console.log("All reservations:", JSON.stringify(allReservations, null, 2));
  } else {
    console.log("Reservations already seeded");
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
