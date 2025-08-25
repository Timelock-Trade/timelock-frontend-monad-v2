import { useMarketData } from "@/context/MarketDataProvider";
import { formatTokenDisplayCondensed } from "@/lib/format";
import { preventMinusAndEKey, preventPasteNegative } from "@/lib/helper";
import { useSelectedTokenPair } from "@/providers/SelectedTokenPairProvider";
import type { AnyFieldApi } from "@tanstack/react-form";
import Big from "big.js";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

const Input = ({
  field,
  setIsMax,
}: {
  field: AnyFieldApi;
  setIsMax: Dispatch<SetStateAction<boolean>>;
}) => {
  const { selectedTokenPair } = useSelectedTokenPair();
  const inputRef = useRef<HTMLInputElement>(null);
  const { primePoolPriceData } = useMarketData();
  const isMobile = useIsMobile(768);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="p-[12px_10px_12px_16px] flex gap-1 flex-row rounded-xl border border-[#282324] bg-[#1a1a1a80] transition-all duration-200 hover:border-[#3a3536] focus-within:border-[#404040] focus-within:shadow-[0_0_0_3px_rgba(255,255,255,0.08)]">
      <div className="flex flex-col gap-0 flex-1 min-w-0">
        <input
          type="number"
          ref={inputRef}
          autoComplete="off"
          placeholder="0"
          id={field.name}
          name={field.name}
          value={field.state.value}
          onChange={(e) => {
            if (setIsMax) {
              setIsMax(false);
            }
            field.handleChange(e.target.value);
          }}
          onWheel={(e) => e.preventDefault()}
          onPaste={preventPasteNegative}
          min={0.0}
          step="any"
          onKeyDown={(e) => {
            preventMinusAndEKey(e);
            if (e.key === "ArrowDown") {
              e.preventDefault();
            }
          }}
          className={`bg-transparent w-full outline-none text-white ${isMobile ? 'text-[20px]' : 'text-[24px]'} font-medium transition-colors placeholder:text-[#6B7280] focus:placeholder:text-[#9CA3AF]`}
        />
        <div className="text-[#9CA3AF] text-xs font-medium whitespace-nowrap truncate">
          {primePoolPriceData?.currentPrice && field.state.value
            ? formatTokenDisplayCondensed(
              Big(primePoolPriceData?.currentPrice)
                .mul(Big(field.state.value))
                .toString(),
              selectedTokenPair[1].decimals
            )
            : "--"}{" "}
          {selectedTokenPair[1].symbol}
        </div>
      </div>
      <div className="flex flex-row gap-2 items-start shrink-0">
        <div className={`flex items-center gap-[6px] text-sm justify-center rounded-md bg-[#0D0D0D] h-[36px] ${isMobile ? 'px-[8px]' : 'px-[12px]'} transition-colors duration-200 hover:bg-[#141414]`}>
          <Image
            src={selectedTokenPair[0].image}
            alt={selectedTokenPair[0].symbol}
            width={16}
            height={16}
          />
          {selectedTokenPair[0].symbol}
        </div>
        <button
          type="button"
          className="text-sm font-medium mt-2 cursor-pointer transition-transform duration-150 hover:scale-105 active:scale-95"
          onClick={() => {
            setIsMax(true);
          }}
        >
          MAX
        </button>
      </div>
    </div>
  );
};

export default Input;
