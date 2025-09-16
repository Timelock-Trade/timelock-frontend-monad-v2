"use client";

import Image from "next/image";
import { useMarketData } from "@/context/MarketDataProvider";
import { usePriceQuery } from "@/hooks/usePriceQuery";
import { markets } from "@/lib/tokens";
import NumberFlow from "@number-flow/react";
import PercentChange from "./PercentChange";


export default function PoolSelectionBar() {
  const { selectedMarket, setSelectedMarket } = useMarketData();
  const { data: wethPriceData } = usePriceQuery(markets["weth-usdc"].primePool);
  const { data: wmonPriceData } = usePriceQuery(markets["wmon-usdc"].primePool);

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
            <span className="text-[#9CA3AF] text-sm whitespace-nowrap">
              WMON / USDC
            </span>
          </div>
          <PercentChange value={wmonPriceData?.percentChange || 0} />
        </div>
        <div className="flex flex-row items-center gap-[6px]">
          <span className="font-medium">
            {wmonPriceData?.currentPrice ? (
              <NumberFlow value={wmonPriceData.currentPrice} />
            ) : (
              "--"
            )}
          </span>
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
            <span className="text-[#9CA3AF] text-sm whitespace-nowrap">
              WETH / USDC
            </span>
          </div>
          <PercentChange value={wethPriceData?.percentChange || 0} />
        </div>
        <div className="flex flex-row items-center gap-[6px]">
          <span className="font-medium">
            {wethPriceData?.currentPrice ? (
              <NumberFlow value={wethPriceData.currentPrice} />
            ) : (
              "--"
            )}
          </span>
          <span className="text-[#9CA3AF] text-xs">USDC</span>
        </div>
      </div>
    </div>
  );
}
