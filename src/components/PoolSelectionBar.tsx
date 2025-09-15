"use client";

import Image from "next/image";
import { ChevronDown } from "@/icons";
import { useMarketData } from "@/context/MarketDataProvider";

export default function PoolSelectionBar() {
  const { selectedMarket, setSelectedMarket } = useMarketData();

  const isSelected = (market: string) => selectedMarket === market;

  const cardBaseClasses =
    "border rounded-[10px] gap-3 flex flex-col p-4 min-w-[220px] cursor-pointer transition-colors";
  const getCardClasses = (market: string) =>
    `${cardBaseClasses} ${
      isSelected(market)
        ? "border-[#4A4A4A] bg-[#1A1A1A]"
        : "border-[#1A1A1A] bg-[#0D0D0D] hover:bg-[#131313]"
    }`;

  return (
    <div className="mt-3 flex flex-row gap-3 overflow-x-auto">
      {/* WMON/USDC */}
      <div
        className={getCardClasses("wmon-usdc")}
        onClick={() => setSelectedMarket("wmon-usdc")}
      >
        <div className="flex flex-row items-center gap-12">
          <div className="flex flex-row items-center gap-[6px]">
            <Image src="/tokens/wmon.png" alt="WMON" width={14} height={14} />
            <span className="text-[#9CA3AF] text-sm whitespace-nowrap">WMON / USDC</span>
          </div>
          <div className="text-[#EC5058] text-xs flex flex-row items-center gap-1">
            <ChevronDown />
            8.50%
          </div>
        </div>
        <div className="flex flex-row items-center gap-[6px]">
          <span className="font-medium">$329.84</span>
          <span className="text-[#9CA3AF] text-xs">USDC</span>
        </div>
      </div>

      {/* WETH/USDC */}
      <div
        className={getCardClasses("weth-usdc")}
        onClick={() => setSelectedMarket("weth-usdc")}
      >
        <div className="flex flex-row items-center gap-12">
          <div className="flex flex-row items-center gap-[6px]">
            <Image src="/tokens/weth.png" alt="WETH" width={14} height={14} />
            <span className="text-[#9CA3AF] text-sm whitespace-nowrap">WETH / USDC</span>
          </div>
          <div className="text-[#19DE92] text-xs flex flex-row items-center gap-1">
            <ChevronDown className="rotate-180" />
            5.10%
          </div>
        </div>
        <div className="flex flex-row items-center gap-[6px]">
          <span className="font-medium">$4,628.80</span>
          <span className="text-[#9CA3AF] text-xs">USDC</span>
        </div>
      </div>
    </div>
  );
}




