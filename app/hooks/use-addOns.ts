import { AddOns } from "@/server/data";
import { useState, useEffect, useCallback } from "react";

export const useAddOns = () => {
  const [addOns, setAddOns] = useState<AddOns[] | []>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAddOns = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/v1/addons");

        if (!response.ok) {
          throw new Error("Request for add-ons failed!");
        }
        const data = await response.json();

        if (!data) {
          throw new Error("No add-ons returned.");
        }
        setAddOns(data.addOns);
      } catch (error) {
        setError(error);
      }

      setLoading(false);
    };

    if (addOns.length === 0) {
      fetchAddOns();
    }
  }, [addOns]);

  return { addOns, loading, error };
};
