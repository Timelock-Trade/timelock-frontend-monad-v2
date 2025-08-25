"use client";

import { ChevronDown } from "@/icons";
import { useSelectedTokenPair } from "@/providers/SelectedTokenPairProvider";
import Image from "next/image";
import { useMarketData } from "@/context/MarketDataProvider";
import NumberFlow from "@number-flow/react";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function SelectedTokenPairDetails() {
  const { selectedTokenPair } = useSelectedTokenPair();
  const { primePoolPriceData } = useMarketData();
  const isMobile = useIsMobile(768);

  return (
    <div className={`flex ${isMobile ? 'flex-col gap-4' : 'flex-row justify-between items-start'}`}>
      <div className="bg-[#0D0D0D] p-4 rounded-xl w-full">
        <div className="flex flex-row items-center p-3 py-[8px] gap-[6px] bg-[#1A1A1A] rounded-xl w-fit">
          <Image
            src={selectedTokenPair[0].image}
            alt={selectedTokenPair[0].symbol}
            width={20}
            height={20}
          />
          <span className="font-semibold mt-[2px]">
            {selectedTokenPair[0].symbol} / {selectedTokenPair[1].symbol}
          </span>
        </div>
        <div className="flex flex-row items-center mt-3 gap-3 justify-between">
          <div className="flex flex-row items-center gap-3">
            <span className={`text-white ${isMobile ? 'text-[24px]' : 'text-[30px]'} font-medium`}>
              {primePoolPriceData?.currentPrice ? (
                <NumberFlow value={primePoolPriceData?.currentPrice} />
              ) : (
                "--"
              )}
            </span>
            <div className="px-3 py-[8px] bg-[#1A1A1A] rounded-[6px]">
              {selectedTokenPair[1].symbol}
            </div>
          </div>
          {!isMobile && (
            <div className="flex flex-row gap-4">
              <StatsCard title="TVL" value="$120.94M" percentage="10.50%" isMobile={isMobile} />
              <StatsCard title="Volume(24H)" value="$13.4M" percentage="8.50%" isMobile={isMobile} />
            </div>
          )}
        </div>
      </div>
      {/* Mobile: keep stats next to the details as before */}
      <div className={`flex ${isMobile ? 'flex-row gap-2' : 'hidden'} ${isMobile ? 'justify-start' : ''}`}>
        {/* TODO: Later only send numbers so neg pos can be checked  */}
        <StatsCard title="TVL" value="$120.94M" percentage="10.50%" isMobile={isMobile} />
        <StatsCard title="Volume(24H)" value="$13.4M" percentage="8.50%" isMobile={isMobile} />
      </div>
    </div>
  );
}

const StatsCard = ({
  title,
  value,
  percentage,
  isMobile,
}: {
  title: string;
  value: string;
  percentage: string;
  isMobile?: boolean;
}) => {
  return (
    <div className={`${isMobile ? 'px-3 py-2' : 'px-4 py-3'} bg-[#0d0d0d] flex flex-col gap-2 h-fit rounded-xl ${isMobile ? 'flex-1' : 'min-w-[140px]'}`}>
      <span className="text-[#616E85] text-xs font-medium">{title}</span>
      <div className={`flex ${isMobile ? 'flex-col gap-1' : 'flex-row items-center justify-between gap-2'}`}>
        <span className={isMobile ? 'text-sm' : 'text-sm font-medium'}>{value}</span>
        <div className="text-[#19DE92] text-xs font-semibold flex flex-row items-center">
          <ChevronDown className="rotate-180" /> {percentage}
        </div>
      </div>
    </div>
  );
};