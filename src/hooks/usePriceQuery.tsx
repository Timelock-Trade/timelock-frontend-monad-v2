import { useQuery } from "@tanstack/react-query";
import { getPriceData } from "@/lib/api";

export function usePriceQuery(poolAddress?: string) {
  return useQuery({
    queryKey: ["prices", poolAddress],
    queryFn: () => getPriceData(poolAddress!),
    enabled: !!poolAddress,
    refetchInterval: 5000,
  });
}
