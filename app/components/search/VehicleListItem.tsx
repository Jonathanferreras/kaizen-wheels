import { formatCents } from "@/lib/formatters";
import { Vehicle } from "@/server/data";
import { useBase64Image } from "@/util/useBase64Image";
import Link from "next/link";

export function VehicleListItem({ vehicle }: { vehicle: Vehicle }) {
  const imgData = useBase64Image(vehicle.thumbnail_url);

  return (
    <li>
      <div>
        <img src={imgData} alt={`${vehicle.make} ${vehicle.model}`} />
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
            <dt>Class</dt>
            <dd>{vehicle.classification}</dd>
          </div>
          <div>
            <dt>Passengers</dt>
            <dd>{vehicle.max_passengers}</dd>
          </div>
          <div>
            <dt>Doors</dt>
            <dd>{vehicle.doors}</dd>
          </div>
        </dl>
      </div>
      <div>
        <p>
          {formatCents(vehicle.hourly_rate_cents)}
          <span>/hr</span>
        </p>
        <Link href={`/review?id=${vehicle.id}`}>Book now</Link>
      </div>
    </li>
  );
}
