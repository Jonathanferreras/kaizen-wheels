import { useState, useEffect, useCallback } from "react";

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/v1/vehicles");

        if (!response.ok) {
          throw new Error("Request for vehicles failed!");
        }
        const data = await response.json();

        if (!data) {
          throw new Error("No vehicles returned.");
        }
        setVehicles(data.vehicles);
      } catch (error) {
        setError(error);
      }

      setLoading(false);
    };

    if (vehicles.length === 0) {
      fetchVehicles();
    }
  }, [vehicles]);

  const getVehicleById = useCallback(
    (id: string) => {
      return vehicles.find((vehicle) => String(vehicle.id) === id);
    },
    [vehicles],
  );

  return { vehicles, loading, error, getVehicleById };
};
