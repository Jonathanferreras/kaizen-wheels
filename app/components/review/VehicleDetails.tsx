import type { Vehicle } from "@/server/data";
import { useBase64Image } from "@/util/useBase64Image";

export interface VehicleDetailsProps {
  vehicle: Vehicle;
}

export function VehicleDetails({ vehicle }: VehicleDetailsProps) {
  const imgData = useBase64Image(vehicle.thumbnail_url);

  return (
    <div>
      <div>
        {imgData && (
          <img src={imgData} alt={`${vehicle.make} ${vehicle.model}`} />
        )}
      </div>
      <div>
        <h2>
          {vehicle.make} {vehicle.model}
        </h2>
        <dl>
          <div>
            <dt>Year</dt>
            <dd>{vehicle.year}</dd>
          </div>
          <div>
            <dt>Passengers</dt>
            <dd>{vehicle.max_passengers}</dd>
          </div>
          <div>
            <dt>Class</dt>
            <dd>{vehicle.classification}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
