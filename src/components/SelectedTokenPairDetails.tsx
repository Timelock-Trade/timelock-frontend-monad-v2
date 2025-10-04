"use client";
import Image from "next/image";
import NumberFlow from "@number-flow/react";
import PercentChange from "./PercentChange";

import { useMarketData } from "@/context/MarketDataProvider";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useTVL } from "@/hooks/useTVL";
import { formatTVLFromScaled } from "@/lib/format";

export default function SelectedTokenPairDetails() {
  const { primePoolPriceData, tokens, primePool } = useMarketData();
  const isMobile = useIsMobile(768);
  const { data: tvlData } = useTVL(primePool);

  return (
    <div className="py-3 px-4 bg-[#0D0D0D] border-b border-[#1A1A1A]">
      <div className="flex items-center gap-6">
        {/* Token Pair */}
        <div className="flex items-center gap-2">
          <Image
            src={tokens[0].image}
            alt={tokens[0].symbol}
            width={24}
            height={24}
          />
          <span className="text-white font-semibold text-lg">
            {tokens[0].symbol}{tokens[1].symbol}
          </span>
          <span className="text-[#999] text-sm">{tokens[0].symbol}</span>
        </div>

        {/* Price */}
        <div className="flex flex-col">
          <span className="text-[#19DE92] text-2xl font-semibold">
            {primePoolPriceData?.currentPrice ? (
              <NumberFlow value={primePoolPriceData.currentPrice} />
            ) : (
              "--"
            )}
          </span>
          <div className="flex items-center gap-2">
            <PercentChange value={primePoolPriceData?.percentChange || 0} />
          </div>
        </div>

        {/* Stats Row */}
        {!isMobile && (
          <div className="flex items-center gap-6 ml-4 text-xs">
            <StatItem label="Mark" value={primePoolPriceData?.currentPrice?.toFixed(1) || "--"} />
            <StatItem label="Index" value={primePoolPriceData?.currentPrice?.toFixed(2) || "--"} />
            <StatItem 
              label="Funding/Countdown" 
              value="0.0100% / 01:00:44" 
              valueColor="text-[#19DE92]"
            />
            <StatItem label="24h volume" value="71.01B" />
            <StatItem label="Open Interest" value="2.71B" />
          </div>
        )}
      </div>
    </div>
  );
}

function StatItem({ label, value, valueColor = "text-white" }: { label: string; value: string; valueColor?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[#999] text-xs">{label}</span>
      <span className={`${valueColor} font-medium`}>{value}</span>
    </div>
  );
}

const StatsCard = ({
  title,
  value,
  percentage,
  isMobile,
  type = "secondary",
}: {
  title: string;
  value: string;
  percentage?: number;
  isMobile?: boolean;
  type?: "primary" | "secondary";
}) => {
  return (
    <div
      className={`${isMobile ? "px-3 py-2" : "px-4 py-3"} ${type === "primary" ? "bg-[#1A1A1A]" : "bg-[#1a1a1a80]"} flex flex-col gap-2 h-fit rounded-md ${isMobile ? "flex-1" : "min-w-[140px]"}`}
    >
      <span className="text-[#616E85] text-xs font-medium">{title}</span>
      <div
        className={`flex ${isMobile ? "flex-col gap-1" : "flex-row items-center justify-between gap-2"}`}
      >
        <span className={isMobile ? "text-sm" : "text-sm font-medium"}>
          {value}
        </span>
        {percentage && <PercentChange value={percentage} />}
      </div>
    </div>
  );
};
