"use client";

import Navbar from "@/components/navbar";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MarketDataProvider } from "@/context/MarketDataProvider";
import { useRouter } from "next/navigation";

type Asset = "ALL" | "ETH" | "SOL" | "BTC";

interface Strategy {
  name: string;
  manager: string;
  tvl: string;
  swapFeeAPR: string;
  premiumARR: string;
  utilization: string;
  profitCut: string;
}

interface Pool {
  name: string;
  percentage: string;
  strategies: Strategy[];
}

const POOLS: Pool[] = [
  {
    name: "WETH/USDC",
    percentage: "0.05% pool",
    strategies: [
      {
        name: "Strat_name1",
        manager: "manager0x1",
        tvl: "$50.0M",
        swapFeeAPR: "5.2%",
        premiumARR: "3.8%",
        utilization: "75%",
        profitCut: "10%",
      },
      {
        name: "Strat_name2",
        manager: "manager0x2",
        tvl: "$30.0M",
        swapFeeAPR: "4.8%",
        premiumARR: "3.2%",
        utilization: "65%",
        profitCut: "12%",
      },
    ],
  },
  {
    name: "BTC/USDC",
    percentage: "0.05% pool",
    strategies: [],
  },
];

export default function EarnClient() {
  const [selectedAsset, setSelectedAsset] = useState<Asset>("ALL");
  const router = useRouter();

  const handleDepositClick = (strategy: Strategy, pool: Pool) => {
    // Navigate to strategy page with parameters
    const params = new URLSearchParams({
      pool: pool.name,
      strategy: strategy.name,
    });
    router.push(`/strategy?${params.toString()}`);
  };

  return (
    <MarketDataProvider>
      <main style={{ fontFamily: "var(--font-ibm)" }}>
        <div className="min-h-dvh w-full relative">
          <div
            className="absolute inset-0 -z-10"
            style={{
              background:
                "linear-gradient(to bottom, rgba(25, 129, 243, 0.08), rgba(0, 0, 0, 0))",
            }}
          />
          <Navbar />
          <div className="max-w-[1440px] mx-auto border-t border-t-[#1A1A1A]">
        <div className="px-6 py-8">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-white text-[32px] font-semibold mb-2">Earn</h1>
              <p className="text-[#9CA3AF] text-[14px]">
                Currently Only a Timelock strategy is offered for each asset.
              </p>
            </div>
            <button className="px-6 bg-[#0D0D0D] py-2.5 hover:cursor-pointer border border-[#3B3B3B] text-white rounded-xl hover:bg-[#1A1A1A] transition-colors text-[14px] font-medium">
              Manage Liquidity
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-3 mb-8">
            {(["ALL", "ETH", "SOL", "BTC"] as Asset[]).map((asset) => (
              <button
                key={asset}
                onClick={() => setSelectedAsset(asset)}
                className={cn(
                  "px-5 bg-[#0D0D0D] hover:cursor-pointer py-2 rounded-lg text-[14px] font-medium transition-colors",
                  selectedAsset === asset
                    ? "bg-[#0D0D0D] border border-[#3B82F6] text-[#3B82F6]"
                    : "bg-[#0D0D0D] border border-[#3B3B3B] text-white hover:bg-[#1A1A1A]"
                )}
              >
                {asset}
              </button>
            ))}
          </div>

          {/* Pools Section */}
          <div className="space-y-4">
            {POOLS.map((pool, index) => (
              <div
                key={pool.name}
                className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-lg overflow-hidden"
              >
                <Accordion type="single" collapsible>
                  <AccordionItem value={`pool-${index}`} className="border-none">
                    <AccordionTrigger className="px-6 py-4 hover:bg-transparent">
                      <div className="flex items-center gap-3">
                        <span className="text-white text-[16px] font-semibold">
                          {pool.name}
                        </span>
                        <span className="text-[#9CA3AF] text-[14px]">
                          {pool.percentage}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      {pool.strategies.length > 0 ? (
                        <div className="px-6 pb-4">
                          {/* Table Header */}
                          <div className="grid grid-cols-8 gap-4 px-4 py-3 bg-[#0D0D0D] rounded-t-lg border-b border-[#1A1A1A]">
                            <div className="text-[#9CA3AF] text-[12px] font-medium">
                              Strategy Name
                            </div>
                            <div className="text-[#9CA3AF] text-[12px] font-medium">
                              Manager
                            </div>
                            <div className="text-[#9CA3AF] text-[12px] font-medium">
                              TVL
                            </div>
                            <div className="text-[#9CA3AF] text-[12px] font-medium">
                              Swap Fee APR
                            </div>
                            <div className="text-[#9CA3AF] text-[12px] font-medium">
                              Premium ARR
                            </div>
                            <div className="text-[#9CA3AF] text-[12px] font-medium">
                              Utilization
                            </div>
                            <div className="text-[#9CA3AF] text-[12px] font-medium">
                              Profit Cut
                            </div>
                            <div></div>
                          </div>

                          {/* Strategy Rows */}
                          {pool.strategies.map((strategy, stratIndex) => (
                            <div
                              key={stratIndex}
                              className="grid grid-cols-8 gap-4 px-4 py-4 bg-[#0D0D0D] border-b border-[#1A1A1A] last:border-b-0 last:rounded-b-lg items-center"
                            >
                              <div className="text-white text-[14px]">
                                {strategy.name}
                              </div>
                              <div className="text-[#9CA3AF] text-[14px]">
                                {strategy.manager}
                              </div>
                              <div className="text-white text-[14px] font-medium">
                                {strategy.tvl}
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-[#3B82F6] text-[14px] font-medium">
                                  {strategy.swapFeeAPR}
                                </span>
                                <span className="text-[#9CA3AF] text-[11px]">
                                  APR
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-[#3B82F6] text-[14px] font-medium">
                                  {strategy.premiumARR}
                                </span>
                                <span className="text-[#9CA3AF] text-[11px]">
                                  ARR
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-[#3B82F6] text-[14px] font-medium">
                                  {strategy.utilization}
                                </span>
                                <div className="w-6 h-6 rounded-full bg-[#3B82F6] flex items-center justify-center">
                                  <span className="text-white text-[10px] font-semibold">
                                    C
                                  </span>
                                </div>
                              </div>
                              <div className="text-white text-[14px] font-medium">
                                {strategy.profitCut}
                              </div>
                              <div className="flex justify-end ">
                                <button 
                                  onClick={() => handleDepositClick(strategy, pool)}
                                  className="px-6 py-2 hover:cursor-pointer bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors text-[14px] font-medium"
                                >
                                  Deposit
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="px-6 pb-4 text-center text-[#9CA3AF] text-[14px]">
                          No strategies available for this pool
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            ))}
          </div>
          </div>
        </div>
        </div>
    </main>
    </MarketDataProvider>
  );
}

