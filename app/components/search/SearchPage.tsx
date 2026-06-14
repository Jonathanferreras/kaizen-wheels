"use client";

import { VehicleList } from "@/components/search/VehicleList.tsx";
import { ErrorFallback } from "@/components/shared/ErrorFallback";
import { ErrorBoundary } from "react-error-boundary";
import { useVehicles } from "@/hooks/use-vehicles";

export function SearchPage() {
  const { vehicles, loading, error } = useVehicles();

  return (
    <div>
      <h1>Kaizen Wheels</h1>
      <ErrorBoundary
        fallback={<ErrorFallback message="Failed to load vehicles" />}
      >
        <VehicleList vehicles={vehicles} />
      </ErrorBoundary>
    </div>
  );
}
