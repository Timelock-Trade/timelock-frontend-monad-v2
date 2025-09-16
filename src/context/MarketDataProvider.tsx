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
  selectedMarket: string;
  setSelectedMarket: Dispatch<SetStateAction<string>>;
}

interface MarketDataProviderProps {
  children: ReactNode;
}

const MarketDataContext = createContext<MarketData | null>(null);

export function MarketDataProvider({ children }: MarketDataProviderProps) {
  const [selectedMarket, setSelectedMarket] = useState("weth-usdc");
  const { optionMarketAddress, primePool, ttlIV, tokens } =
    markets[selectedMarket];

  const [selectedDurationIndex, setSelectedDurationIndex] = useState(1);
  const { data: primePoolPriceData } = usePriceQuery(primePool);

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
        selectedMarket,
        setSelectedMarket,
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
