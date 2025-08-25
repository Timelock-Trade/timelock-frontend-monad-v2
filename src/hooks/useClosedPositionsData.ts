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
      // Closed positions are global; optionally filter by owner once backend supports it
      const response = await fetch(
        `${apiUrl}/expired-options`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = (await response.json()) as { options: ClosedPositionRaw[] };

      // Filter by connected user and current chain if available
      const filtered = data.options.filter((o) => {
        const ownerOk = address ? o.owner.toLowerCase() === address.toLowerCase() : true;
        const chainOk = chainId ? o.chainId === chainId : true;
        return ownerOk && chainOk;
      });

      // Map minimal fields required for display in a closed positions table
      const positions: ClosedPosition[] = filtered
        .map((o) => ({
          tokenId: o.tokenId,
          market: o.market,
          owner: o.owner,
          createdAt: o.createdAt,
          expiry: o.expiry,
          isCall: o.isCall,
          strike: o.internalOptions?.[0]?.strike,
        }))
        .sort((a, b) => b.createdAt - a.createdAt);

      return { positions };
    },
    enabled: true,
    refetchInterval: 10000,
  });
}


