import { API } from "@/server/api";
import { VehicleListItem } from "./VehicleListItem";

export function VehicleList() {
  const searchResponse = API.searchVehicles();

  if (searchResponse.vehicles.length === 0) {
    return (
      <div>
        <p>No vehicles found.</p>
      </div>
    );
  }

  return (
    <ul>
      {searchResponse.vehicles.map((vehicle) => (
        <VehicleListItem key={vehicle.id} vehicle={vehicle} />
      ))}
    </ul>
  );
}
