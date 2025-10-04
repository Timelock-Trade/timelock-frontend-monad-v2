"use client";

import Navbar from "../components/navbar";
import SelectedTokenPairDetails from "@/components/SelectedTokenPairDetails";
import Tables from "@/components/tables";
import TradingPanel from "@/components/trading-panel/TradingPanel";
import Graph from "@/components/graph";
import { MarketDataProvider } from "@/context/MarketDataProvider";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import PoolSelectionBar from "@/components/PoolSelectionBar";
import TickerBar from "@/components/TickerBar";

export default function HomeClient() {
  const [hasMounted, setHasMounted] = useState(false);
  const isMobile = useIsMobile(768);
  
  useEffect(() => setHasMounted(true), []);

  if (!hasMounted) {
    return <div className="min-h-screen w-full bg-[#0D0D0D]" />;
  }
  return (
    <MarketDataProvider>
      <main style={{ fontFamily: "var(--font-ibm)" }} className="pb-10">
        <Navbar />
        <div className="w-full">
          {isMobile ? (
            // Mobile Layout: Single column
            <>
              {/* Token Pair + Stats Section */}
              <SelectedTokenPairDetails />

              {/* Chart Section */}
              <div className="border border-[#1A1A1A] p-[12px] pb-[0px] rounded-sm relative">
                <div className="mb-4 h-[300px] flex items-center justify-center">
                  <Graph />
                </div>
              </div>
              {/* Pool Selection under chart */}
              <div className="px-6">
                <PoolSelectionBar />
              </div>
              
              {/* Trading Panel Section */}
              <div className="mt-4">
                <TradingPanel />
              </div>
              
              {/* Positions Table Section */}
              <div className="mt-4 mb-4">
                <Tables />
              </div>
            </>
          ) : (
            // Desktop Layout: Full width design
            <div className="w-full flex flex-row">
              <div className="w-full flex-1" style={{ background: "#0D0D0D" }}>
                <SelectedTokenPairDetails />
                <div className="p-0 relative">
                  <div className="h-[500px] flex items-center justify-center bg-[#0A0A0A]">
                    <Graph />
                  </div>
                </div>
                <div className="px-4">
                  <PoolSelectionBar />
                </div>
                <div className="mb-20 px-4">
                  <Tables />
                </div>
              </div>
              <TradingPanel />
            </div>
          )}
        </div>
        <TickerBar />
      </main>
    </MarketDataProvider>
  );
} 