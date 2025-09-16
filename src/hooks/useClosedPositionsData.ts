import { useQuery } from "@tanstack/react-query";
import { useAccount, useChainId } from "wagmi";

export interface ClosedPositionInternalOption {
  handler: string;
  pool: string;
  hook: string;
  liquidityAtOpen: string;
  liquidityExercised: string;
  liquiditySettled: string;
  liquidityAtLive: string;
  strike: string;
  index: string;
  tickLower: string;
  tickUpper: string;
}

export interface ClosedPositionRaw {
  tokenId: string;
  market: string;
  owner: string;
  createdAt: number;
  expiry: number;
  isCall: boolean;
  opTickArrayLen: number;
  chainId: number;
  internalOptions: ClosedPositionInternalOption[];
  amount: string;
}

export interface ClosedPosition {
  tokenId: string;
  market: string;
  owner: string;
  createdAt: number;
  expiry: number;
  isCall: boolean;
  // Display fields aligned with open positions where applicable
  callAsset?: string;
  putAsset?: string;
  amount?: string;
  paid?: string;
  value?: string;
  strike?: string; // raw strike in 1e18 units
}

export function useClosedPositionsData() {
  const { address } = useAccount();
  const chainId = useChainId();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  return useQuery({
    queryKey: ["closed-positions", address, chainId],
    queryFn: async () => {
      if (!address || !chainId)
        return { positions: [] } as { positions: ClosedPosition[] };

      const response = await fetch(
        `${apiUrl}/closed-options?address=${address}&chainId=${chainId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = (await response.json()) as { options: ClosedPositionRaw[] };

      // Map minimal fields required for display in a closed positions table
      const positions: ClosedPosition[] = data.options
        .map((o) => ({
          tokenId: o.tokenId,
          market: o.market,
          owner: o.owner,
          createdAt: o.createdAt,
          expiry: o.expiry,
          isCall: o.isCall,
          strike: o.internalOptions?.[0]?.strike,
          amount: o.amount,
        }))
        .sort((a, b) => b.createdAt - a.createdAt);

      return { positions };
    },
    enabled: true,
    refetchInterval: 10000,
  });
}
