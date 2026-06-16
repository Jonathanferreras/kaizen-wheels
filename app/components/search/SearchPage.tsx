"use client";

import { VehicleList } from "@/components/search/VehicleList.tsx";
import { ErrorFallback } from "@/components/shared/ErrorFallback";
import { ErrorBoundary } from "react-error-boundary";
import { useVehicles } from "@/hooks/use-vehicles";

export function SearchPage() {
  const { vehicles, loading, error } = useVehicles();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold tracking-tight text-slate-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Kaizen Wheels
              </span>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorBoundary
          fallback={<ErrorFallback message="Failed to load vehicles" />}
        >
          <VehicleList vehicles={vehicles} />
        </ErrorBoundary>
      </main>
    </div>
  );
}
