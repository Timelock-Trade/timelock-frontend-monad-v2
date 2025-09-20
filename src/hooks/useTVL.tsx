import { useQuery } from "@tanstack/react-query";
import { useChainId } from "wagmi";

interface TVLData {
  pool: string;
  totalAmount0: string;
  totalAmount1: string;
  tvl0: string;
  tvl1: string;
  token0: {
    address: string;
    decimals: number;
  };
  token1: {
    address: string;
    decimals: number;
  };
  currentTick: number;
  chainId: number;
}

export function useTVL(poolAddress?: string) {
  const chainId = useChainId();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  return useQuery({
    queryKey: ["tvl", poolAddress, chainId],
    queryFn: async () => {
      if (!poolAddress || !chainId) return null;

      const response = await fetch(
        `${apiUrl}/tvl/${poolAddress}?chainId=${chainId}`,
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TVLData = await response.json();
      return data;
    },
    enabled: !!poolAddress && !!chainId,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}
