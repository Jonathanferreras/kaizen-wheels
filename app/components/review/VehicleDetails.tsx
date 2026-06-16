import type { Vehicle } from "@/server/data";
import { useBase64Image } from "@/util/useBase64Image";

export interface VehicleDetailsProps {
  vehicle: Vehicle;
}

export function VehicleDetails({ vehicle }: VehicleDetailsProps) {
  const imgData = useBase64Image(vehicle.thumbnail_url);

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="grid gap-0 md:grid-cols-[320px_1fr]">
        <div className="aspect-[4/3] bg-slate-100 md:aspect-auto">
          {imgData && (
            <img
              src={imgData}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div className="flex flex-col justify-center p-5 sm:p-6">
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
            Selected vehicle
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-slate-950">
            {vehicle.make} {vehicle.model}
          </h2>

          <dl className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Year
              </dt>
              <dd className="mt-1 text-sm font-semibold text-slate-950">
                {vehicle.year}
              </dd>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Passengers
              </dt>
              <dd className="mt-1 text-sm font-semibold text-slate-950">
                {vehicle.max_passengers}
              </dd>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Class
              </dt>
              <dd className="mt-1 text-sm font-semibold text-slate-950">
                {vehicle.classification}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
