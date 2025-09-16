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

export default function HomeClient() {
  const [hasMounted, setHasMounted] = useState(false);
  const isMobile = useIsMobile(768);
  
  useEffect(() => setHasMounted(true), []);

  if (!hasMounted) {
    return <div className="min-h-screen w-full bg-[#0D0D0D]" />;
  }
  return (
    <MarketDataProvider>
      <main style={{ fontFamily: "var(--font-ibm)" }}>
        <Navbar />
        <div className="max-w-[1440px] mx-auto border-t border-t-[#1A1A1A]">
          {isMobile ? (
            // Mobile Layout: Single column
            <>
              {/* Token Pair + Stats Section */}
              <SelectedTokenPairDetails />

              {/* Chart Section */}
              <div className="border border-[#1A1A1A] p-[12px] pb-[0px] rounded-md relative">
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
            // Desktop Layout: Match original flex-row design
            <div className="max-w-[1440px] flex flex-row mx-auto">
              <div className="pl-6 w-full max-w-[1054px] pr-6" style={{ background: "#0D0D0D" }}>
                <SelectedTokenPairDetails />
                <div className="border border-[#1A1A1A] p-[12px] pb-[0px] rounded-md relative">
                  <div className="mb-4 h-[500px] flex items-center justify-center">
                    <Graph />
                  </div>
                </div>
                <PoolSelectionBar />
                <div className="mb-20">
                  <Tables />
                </div>
              </div>
              <TradingPanel />
            </div>
          )}
        </div>
      </main>
    </MarketDataProvider>
  );
} 