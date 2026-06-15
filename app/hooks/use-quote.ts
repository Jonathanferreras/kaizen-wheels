import { Discounts } from "@/server/data";
import { useEffect, useState } from "react";

export type Quote = {
  totalPriceCents: number;
  hourlyRateCents: number;
  durationInHours: number;
  discountApplied: boolean;
  discountType: Discounts;
};

type UseQuoteInput = {
  vehicleId: string | null | undefined;
  startTime: string | null | undefined;
  endTime: string | null | undefined;
};

export const useQuote = ({ vehicleId, startTime, endTime }: UseQuoteInput) => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!vehicleId || !startTime || !endTime) {
      setQuote(null);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchQuote = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          start: startTime,
          end: endTime,
        });
        const response = await fetch(
          `/api/v1/vehicles/${vehicleId}/quote?${params}`,
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error ?? "Request for quote failed!");
        }

        const data = await response.json();
        setQuote(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setQuote(null);
      }

      setLoading(false);
    };

    fetchQuote();
  }, [vehicleId, startTime, endTime]);

  return { quote, loading, error };
};
