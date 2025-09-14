"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  SetStateAction,
  Dispatch,
} from "react";
import { PriceData } from "@/lib/api";
import { usePriceQuery } from "@/hooks/usePriceQuery";
import { IVDataPoint, markets, Token } from "@/lib/tokens";

interface MarketData {
  ttlIV: IVDataPoint[];
  optionMarketAddress: string;
  primePool: string;
  primePoolPriceData: PriceData | undefined;
  selectedDurationIndex: number;
  setSelectedDurationIndex: Dispatch<SetStateAction<number>>;
  tokens: Token[];
}

interface MarketDataProviderProps {
  children: ReactNode;
}

const MarketDataContext = createContext<MarketData | null>(null);

export function MarketDataProvider({ children }: MarketDataProviderProps) {
  const market = "wmon-usdc";
  const { optionMarketAddress, primePool, ttlIV, tokens } = markets[market];

  const [selectedDurationIndex, setSelectedDurationIndex] = useState(1);
  const { data: priceData } = usePriceQuery();

  const primePoolPriceData = priceData?.find(
    (price) => price.poolAddress === primePool,
  );

  return (
    <MarketDataContext.Provider
      value={{
        ttlIV,
        optionMarketAddress,
        primePool,
        primePoolPriceData,
        selectedDurationIndex,
        setSelectedDurationIndex,
        tokens,
      }}
    >
      {children}
    </MarketDataContext.Provider>
  );
}

export function useMarketData() {
  const context = useContext(MarketDataContext);
  if (!context) {
  throw new Error("useIVData must be used within an IVDataProvider");
  }
  return context;
}
