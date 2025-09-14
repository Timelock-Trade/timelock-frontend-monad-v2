"use client";
import Image from "next/image";
import NumberFlow from "@number-flow/react";
import { ChevronDown } from "@/icons";

import { useMarketData } from "@/context/MarketDataProvider";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function SelectedTokenPairDetails() {
  const { primePoolPriceData, tokens } = useMarketData();
  const isMobile = useIsMobile(768);

  return (
    <div
      className={`flex ${isMobile ? "flex-col gap-4" : "flex-row justify-between items-start"} py-4`}
    >
      <div className="w-full">
        <div className="flex flex-row items-center gap-3 justify-between">
          <div className="flex flex-row gap-4">
            <div className="px-6 flex flex-row items-center gap-[6px] bg-[#1A1A1A] rounded-lg w-fit">
              <Image
                src={tokens[0].image}
                alt={tokens[0].symbol}
                width={20}
                height={20}
              />
              <span className="font-semibold mt-[2px]">
                {tokens[0].symbol} / {tokens[1].symbol}
              </span>
            </div>
            <div className="px-4 pb-2 pt-2  bg-[#1a1a1a80] rounded-md">
              <div className="flex flex-row items-end gap-2 w-full justify-between">
                <span className="text-[#616E85] text-xs font-medium">
                  Spot Price
                </span>
                <div className="text-[#19DE92] text-xs font-semibold flex flex-row items-center">
                  <ChevronDown className="rotate-180" /> 10%
                </div>
              </div>
              <div className="flex flex-row items-end gap-4 mt-1">
                <span className="text-xl">
                  {primePoolPriceData?.currentPrice ? (
                    <NumberFlow value={primePoolPriceData.currentPrice} />
                  ) : (
                    "--"
                  )}
                </span>
                <span className="text-muted-foreground">
                  {tokens[1].symbol}
                </span>
              </div>
            </div>
            {/*<StatsCard
            title="Spot Price"
            value={primePoolPriceData?.currentPrice ? formatCondensed(primePoolPriceData?.currentPrice) + ' ' + selectedTokenPair[1].symbol : "--"}
            percentage="10.50%"
            isMobile={isMobile}
          />*/}
          </div>
          {!isMobile && (
            <div className="flex flex-row gap-4">
              <StatsCard
                title="TVL"
                value="$120.94M"
                percentage="10.50%"
                isMobile={isMobile}
              />
              <StatsCard
                title="Volume(24H)"
                value="$13.4M"
                percentage="8.50%"
                isMobile={isMobile}
              />
            </div>
          )}
        </div>
      </div>
      {/* Mobile: keep stats next to the details as before */}
      <div
        className={`flex ${isMobile ? "flex-row gap-2" : "hidden"} ${isMobile ? "justify-start" : ""}`}
      >
        {/* TODO: Later only send numbers so neg pos can be checked  */}
        <StatsCard
          title="TVL"
          value="$120.94M"
          percentage="10.50%"
          isMobile={isMobile}
        />
        <StatsCard
          title="Volume(24H)"
          value="$13.4M"
          percentage="8.50%"
          isMobile={isMobile}
        />
      </div>
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
  percentage?: string;
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
        {percentage && (
          <div className="text-[#19DE92] text-xs font-semibold flex flex-row items-center">
            <ChevronDown className="rotate-180" /> {percentage}
          </div>
        )}
      </div>
    </div>
  );
};
