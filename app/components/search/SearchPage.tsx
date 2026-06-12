"use client";

import { VehicleList } from "@/components/search/VehicleList.tsx";
import { ErrorFallback } from "@/components/shared/ErrorFallback";
import { ErrorBoundary } from "react-error-boundary";

export function SearchPage() {
  return (
    <div>
      <h1>Kaizen Wheels</h1>
      <ErrorBoundary
        fallback={<ErrorFallback message="Failed to load vehicles" />}
      >
        <VehicleList />
      </ErrorBoundary>
    </div>
  );
}
