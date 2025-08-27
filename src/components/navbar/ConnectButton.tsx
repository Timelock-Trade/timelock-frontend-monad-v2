"use client";

import { ConnectKitButton } from "connectkit";
import { truncateAddress } from "@/lib/helper";
import { cn } from "@/lib/utils";
import { ArrowDownIcon } from "@/icons";
import { useAccount, useBalance } from "wagmi";
import { USDC } from "@/lib/tokens";
import { useSelectedTokenPair } from "@/providers/SelectedTokenPairProvider";
import { formatTokenDisplayCondensed } from "@/lib/format";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

const ConnectButton = () => {
  const { selectedTokenPair } = useSelectedTokenPair();
  const { isConnected, address } = useAccount();
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useIsMobile();

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: balanceData, isLoading } = useBalance({
    address: address,
    token: USDC.address as `0x${string}`,
    query: {
      enabled: isConnected && !!address && isMounted,
      refetchInterval: 3000,
    },
  });

  return (
    <div className="flex flex-row items-center bg-[#131313] rounded-[14px] overflow-hidden flex-shrink-0">
      {isConnected && isMounted && !isMobile && (
        <div className="w-fit flex h-full px-2 pl-3 text-xs whitespace-nowrap">
          {isLoading ? (
            <div className="h-4 w-12 animate-pulse rounded bg-gray-700" />
          ) : (
            `${
              balanceData
                ? formatTokenDisplayCondensed(
                    balanceData.formatted,
                    selectedTokenPair[1].decimals
                  )
                : "--"
            } ${selectedTokenPair[1].symbol}`
          )}
        </div>
      )}
      <div className="min-h-[42px] transition-transform duration-150 ease-out hover:scale-[1.04] active:scale-[0.98] will-change-transform">
        <ConnectKitButton.Custom>
          {({ isConnected, show, address, truncatedAddress, ensName }) => (
            <button
              onClick={show}
              className={cn(
                "h-[42px] whitespace-nowrap rounded-[14px] bg-white text-[#0D0D0D] font-semibold cursor-pointer flex-shrink-0",
                "transition-all duration-200",
                isMobile 
                  ? "px-2 min-w-[70px] text-sm" 
                  : "px-4 min-w-[120px] text-[15px]",
                isConnected && "text-[#D1D5DA] font-bold bg-white/[0.06]"
              )}
            >
              {isConnected && address ? (
                <div className="flex flex-row items-center gap-2 justify-center">
                  {isMobile ? (
                    // On mobile, show only truncated address without ENS for space
                    truncateAddress(address, 3)
                  ) : (
                    // On desktop, show ENS name if available, otherwise truncated address
                    ensName || truncatedAddress
                  )}
                  <ArrowDownIcon />
                </div>
              ) : (
                isMobile ? "Connect" : "Connect"
              )}
            </button>
          )}
        </ConnectKitButton.Custom>
      </div>
    </div>
  );
};

export default ConnectButton;