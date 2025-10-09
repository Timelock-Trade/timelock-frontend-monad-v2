"use client";

import Navbar from "@/components/navbar";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAccount, useBalance } from "wagmi";
import { USDC } from "@/lib/tokens";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MarketDataProvider } from "@/context/MarketDataProvider";

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

// Mock data - in real app this would come from API
const POOLS: Pool[] = [
  {
    name: "WETH/USDC",
    percentage: "0.05% pool",
    strategies: [
      {
        name: "Strat_name1",
        manager: "Nelson",
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

export default function StrategyPageClient() {
  const [amount, setAmount] = useState("0.0");
  const [selectedTab, setSelectedTab] = useState<"deposit" | "withdraw">("deposit");
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [pool, setPool] = useState<Pool | null>(null);
  const { address, isConnected } = useAccount();
  const searchParams = useSearchParams();
  const router = useRouter();

  const { data: balanceData } = useBalance({
    address: address,
    token: USDC.address as `0x${string}`,
    query: {
      enabled: isConnected && !!address,
    },
  });

  const balance = balanceData ? parseFloat(balanceData.formatted) : 0;

  useEffect(() => {
    // Get strategy and pool from URL params
    const poolName = searchParams.get('pool');
    const strategyName = searchParams.get('strategy');
    
    if (poolName && strategyName) {
      const foundPool = POOLS.find(p => p.name === poolName);
      const foundStrategy = foundPool?.strategies.find(s => s.name === strategyName);
      
      if (foundPool && foundStrategy) {
        setPool(foundPool);
        setStrategy(foundStrategy);
      } else {
        // Redirect back to earn page if not found
        router.push('/earn');
      }
    } else {
      // Redirect back to earn page if no params
      router.push('/earn');
    }
  }, [searchParams, router]);

  const handleDeposit = () => {
    // TODO: Implement actual deposit logic
    console.log("Depositing", amount, "to strategy", strategy?.name);
  };

  const handleMaxClick = () => {
    setAmount(balance.toFixed(1));
  };

  const handleBackClick = () => {
    router.push('/earn');
  };

  if (!strategy || !pool) {
    return (
      <MarketDataProvider>
        <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      </MarketDataProvider>
    );
  }

  return (
    <MarketDataProvider>
      <div className="min-h-screen bg-[#0D0D0D]">
        <Navbar />
        
        <main style={{ fontFamily: "var(--font-ibm)" }}>
        <div className="max-w-[1440px] mx-auto px-6 py-8">
          {/* Back Button */}
          <button
            onClick={handleBackClick}
            className="flex items-center gap-2 text-[#9CA3AF] hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Earn
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Strategy Header */}
              <div className="bg-[#131313] rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-white text-2xl font-semibold">{pool.name}</h1>
                    <div className="text-[#3B82F6] text-lg font-medium mt-1">
                      {strategy.name === "Strat_name1" ? "Timelock Strat 1" : strategy.name}
                    </div>
                    <div className="text-[#9CA3AF] text-sm mt-1">
                      Managed by {strategy.manager} • Holds more than 10% of the vault
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                      High Risk
                    </span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                      High Returns
                    </span>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-[#0D0D0D] rounded-lg p-4">
                    <div className="text-[#9CA3AF] text-sm">Volume</div>
                    <div className="text-white text-lg font-semibold">$2M 24h</div>
                  </div>
                  <div className="bg-[#0D0D0D] rounded-lg p-4">
                    <div className="text-[#9CA3AF] text-sm">Current Range</div>
                    <div className="text-white text-lg font-semibold">2000-3000 USDC</div>
                  </div>
                  <div className="bg-[#0D0D0D] rounded-lg p-4">
                    <div className="text-[#9CA3AF] text-sm">Swap Fees</div>
                    <div className="text-white text-lg font-semibold">$50k earned</div>
                  </div>
                  <div className="bg-[#0D0D0D] rounded-lg p-4">
                    <div className="text-[#9CA3AF] text-sm">Premium Earned</div>
                    <div className="text-white text-lg font-semibold">$350k total</div>
                  </div>
                </div>
              </div>

              {/* Price Chart */}
              <div className="bg-[#131313] rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-[#3B82F6] text-white text-sm rounded">
                      Ethereum
                    </button>
                    <button className="px-4 py-2 bg-[#131313] text-[#9CA3AF] text-sm rounded">
                      Bitcoin
                    </button>
                  </div>
                  <div className="flex gap-1">
                    <button className="px-3 py-1 bg-[#131313] text-[#9CA3AF] text-sm rounded">1D</button>
                    <button className="px-3 py-1 bg-[#131313] text-[#9CA3AF] text-sm rounded">1W</button>
                    <button className="px-3 py-1 bg-[#3B82F6] text-white text-sm rounded">1M</button>
                    <button className="px-3 py-1 bg-[#131313] text-[#9CA3AF] text-sm rounded">3M</button>
                    <button className="px-3 py-1 bg-[#131313] text-[#9CA3AF] text-sm rounded">6M</button>
                    <button className="px-3 py-1 bg-[#131313] text-[#9CA3AF] text-sm rounded">1Y</button>
                    <button className="px-3 py-1 bg-[#131313] text-[#9CA3AF] text-sm rounded">ALL</button>
                  </div>
                </div>
                <div className="h-64 bg-[#0D0D0D] rounded flex items-center justify-center mb-4">
                  <div className="text-[#9CA3AF] text-lg">Price Chart</div>
                </div>
                <div className="text-[#9CA3AF] text-sm mb-2">Creation Date: Feb 23, 2024</div>
                <div className="flex flex-wrap gap-4">
                  <div className="text-green-400 text-sm">1D: +2.3%</div>
                  <div className="text-green-400 text-sm">1W: +9.7%</div>
                  <div className="text-green-400 text-sm">1M: +0.3%</div>
                  <div className="text-green-400 text-sm">6M: +11.3%</div>
                  <div className="text-red-400 text-sm">1Y: -19.1%</div>
                  <div className="text-green-400 text-sm">All: +24.1%</div>
                </div>
              </div>

              {/* Vault Assets */}
              <div className="bg-[#131313] rounded-lg p-6">
                <div className="text-white text-lg font-semibold mb-4">Vault Assets</div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white">ETH</span>
                      <span className="text-[#9CA3AF]">10%</span>
                    </div>
                    <div className="w-full bg-[#0D0D0D] rounded-full h-3">
                      <div className="bg-[#3B82F6] h-3 rounded-full" style={{ width: "10%" }}></div>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-[#9CA3AF]">1 ETH</span>
                      <span className="text-white">VALUE: $1000</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white">USDC</span>
                      <span className="text-[#9CA3AF]">90%</span>
                    </div>
                    <div className="w-full bg-[#0D0D0D] rounded-full h-3">
                      <div className="bg-[#3B82F6] h-3 rounded-full" style={{ width: "90%" }}></div>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-[#9CA3AF]">9000 USDC</span>
                      <span className="text-white">VALUE: $9000</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Liquidity Distribution */}
              <div className="bg-[#131313] rounded-lg p-6">
                <div className="text-white text-lg font-semibold mb-4">Liquidity Distribution</div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#3B82F6] rounded-full"></div>
                    <span className="text-[#9CA3AF] text-sm">WETH</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#8B5CF6] rounded-full"></div>
                    <span className="text-[#9CA3AF] text-sm">USDC</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#F97316] rounded-full"></div>
                    <span className="text-[#9CA3AF] text-sm">Utilized for options</span>
                  </div>
                </div>
                <div className="h-32 bg-[#0D0D0D] rounded flex items-center justify-center mb-4">
                  <div className="text-[#9CA3AF] text-lg">Liquidity Chart</div>
                </div>
                <div className="text-[#9CA3AF] text-sm">Current price: 2.47k</div>
              </div>

              {/* Strategy Details Grid */}
              <div className="bg-[#131313] rounded-lg p-6">
                <div className="text-white text-lg font-semibold mb-4">Strategy Details</div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    "Vault Address", "Manager Address", "Vault Token Price",
                    "All - Time High", "Total Shares", "Manager Stake",
                    "Sortino Ratio", "Downside Volatility", "Leaderboard Rank",
                    "Earned Fees", "Manager Logic Address"
                  ].map((label, index) => (
                    <div key={index} className="bg-[#0D0D0D] rounded-lg p-3 text-center">
                      <div className="text-[#9CA3AF] text-sm mb-2">{label}</div>
                      <div className="text-white text-sm font-medium">
                        {index === 3 || index === 7 ? "10%" : "1%"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Deposit/Withdraw Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-[#131313] rounded-lg p-6 sticky top-6">
                {/* Tabs */}
                <div className="flex gap-1 mb-6">
                  <button
                    onClick={() => setSelectedTab("deposit")}
                    className={cn(
                      "px-4 py-2 rounded text-sm font-medium transition-colors",
                      selectedTab === "deposit"
                        ? "bg-[#3B82F6] text-white"
                        : "bg-[#0D0D0D] text-[#9CA3AF]"
                    )}
                  >
                    Deposit
                  </button>
                  <button
                    onClick={() => setSelectedTab("withdraw")}
                    className={cn(
                      "px-4 py-2 rounded text-sm font-medium transition-colors",
                      selectedTab === "withdraw"
                        ? "bg-[#3B82F6] text-white"
                        : "bg-[#0D0D0D] text-[#9CA3AF]"
                    )}
                  >
                    Withdraw
                  </button>
                </div>

                {selectedTab === "deposit" && (
                  <div className="space-y-4">
                    <div>
                      <div className="text-[#9CA3AF] text-sm mb-2">Amount</div>
                      <div className="text-[#9CA3AF] text-sm mb-2">Balance: {balance.toFixed(1)} USDC</div>
                      <div className="relative">
                        <input
                          type="text"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0.0"
                          className="w-full bg-[#0D0D0D] border border-[#282324] rounded-lg px-4 py-3 text-white placeholder-[#9CA3AF] focus:outline-none focus:border-[#3B82F6]"
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                          <button className="px-3 py-1 bg-[#3B82F6] text-white text-xs rounded">
                            USDC
                          </button>
                          <button 
                            onClick={handleMaxClick}
                            className="px-3 py-1 bg-[#131313] text-[#9CA3AF] text-xs rounded hover:bg-[#1a1a1a]"
                          >
                            MAX
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="text-[#9CA3AF] text-sm">
                      You will receive (est.) ≈ 0.099 ttETH
                    </div>

                    <div className="text-[#9CA3AF] text-sm">
                      Deposit Fee ~2%~→0%
                    </div>

                    <button
                      onClick={handleDeposit}
                      className="w-full bg-[#3B82F6] text-white font-medium py-3 rounded-lg hover:bg-[#2563EB] transition-colors"
                    >
                      Deposit USDC
                    </button>
                  </div>
                )}

                {selectedTab === "withdraw" && (
                  <div className="space-y-4">
                    <div>
                      <div className="text-[#9CA3AF] text-sm mb-2">Amount</div>
                      <div className="text-[#9CA3AF] text-sm mb-2">Balance: 0.0 ttETH</div>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="0.0"
                          className="w-full bg-[#0D0D0D] border border-[#282324] rounded-lg px-4 py-3 text-white placeholder-[#9CA3AF] focus:outline-none focus:border-[#3B82F6]"
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                          <button className="px-3 py-1 bg-[#3B82F6] text-white text-xs rounded">
                            ttETH
                          </button>
                          <button className="px-3 py-1 bg-[#131313] text-[#9CA3AF] text-xs rounded hover:bg-[#1a1a1a]">
                            MAX
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="text-[#9CA3AF] text-sm">
                      You will receive (est.) ≈ 0.0 USDC
                    </div>

                    <div className="text-[#9CA3AF] text-sm">
                      Withdrawal Fee ~0.1%
                    </div>

                    <button
                      className="w-full bg-[#3B82F6] text-white font-medium py-3 rounded-lg hover:bg-[#2563EB] transition-colors"
                    >
                      Withdraw ttETH
                    </button>
                  </div>
                )}

                {/* Info Box */}
                <div className="mt-6 p-4 bg-[#0D0D0D] rounded-lg">
                  <div className="text-white text-sm font-medium mb-2">Lorem ipsum</div>
                  <div className="text-[#9CA3AF] text-xs">
                    Lorem ipsum dolor sit amet consectetur. Nunc semper ultricies ultricies at vitae vel.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    </MarketDataProvider>
  );
}
