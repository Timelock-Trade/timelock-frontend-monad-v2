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
    "border rounded-sm gap-2 flex flex-col p-3 min-w-[200px] cursor-pointer transition-colors";
  const getCardClasses = (market: string) =>
    `${cardBaseClasses} ${
      isSelected(market)
        ? "border-[#333] bg-[#151515]"
        : "border-[#1A1A1A] bg-[#0A0A0A] hover:bg-[#111]"
    }`;

  return (
    <div className="mt-4 mb-3 flex flex-row gap-3 overflow-x-auto">
      {/* WMON/USDC */}
      <div
        className={getCardClasses("wmon-usdc")}
        onClick={() => setSelectedMarket("wmon-usdc")}
      >
        <div className="flex flex-row items-center gap-8">
          <div className="flex flex-row items-center gap-[6px]">
            <Image src="/tokens/wmon.png" alt="WMON" width={12} height={12} />
            <span className="text-[#999] text-xs whitespace-nowrap">
              WMON / USDC
            </span>
          </div>
          <PercentChange value={wmonPriceData?.percentChange || 0} />
        </div>
        <div className="flex flex-row items-center gap-[6px]">
          <span className="font-medium text-sm">
            {wmonPriceData?.currentPrice ? (
              <NumberFlow value={wmonPriceData.currentPrice} />
            ) : (
              "--"
            )}
          </span>
          <span className="text-[#999] text-xs">USDC</span>
        </div>
      </div>

      {/* WETH/USDC */}
      <div
        className={getCardClasses("weth-usdc")}
        onClick={() => setSelectedMarket("weth-usdc")}
      >
        <div className="flex flex-row items-center gap-8">
          <div className="flex flex-row items-center gap-[6px]">
            <Image src="/tokens/weth.png" alt="WETH" width={12} height={12} />
            <span className="text-[#999] text-xs whitespace-nowrap">
              WETH / USDC
            </span>
          </div>
          <PercentChange value={wethPriceData?.percentChange || 0} />
        </div>
        <div className="flex flex-row items-center gap-[6px]">
          <span className="font-medium text-sm">
            {wethPriceData?.currentPrice ? (
              <NumberFlow value={wethPriceData.currentPrice} />
            ) : (
              "--"
            )}
          </span>
          <span className="text-[#999] text-xs">USDC</span>
        </div>
      </div>
    </div>
  );
}
