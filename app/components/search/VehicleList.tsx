import { VehicleListItem } from "./VehicleListItem";
import { useVehicles } from "@/hooks/use-vehicles";

export function VehicleList() {
  const { vehicles, loading, error } = useVehicles();

  if (vehicles.length === 0) {
    return (
      <div>
        <p>No vehicles found.</p>
      </div>
    );
  }

  return (
    <ul>
      {vehicles.map((vehicle) => (
        <VehicleListItem key={vehicle.id} vehicle={vehicle} />
      ))}
    </ul>
  );
}
