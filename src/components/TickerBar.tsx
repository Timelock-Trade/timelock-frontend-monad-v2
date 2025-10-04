"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface TickerItem {
  symbol: string;
  displayName: string;
  icon: string;
  price: string;
  change: string;
  isPositive: boolean;
  markPrice: string;
}

const TICKER_DATA: TickerItem[] = [
  { 
    symbol: "ETHUSDT", 
    displayName: "Ethereum",
    icon: "/tokens/eth.png",
    price: "4,475.9", 
    change: "0.102", 
    isPositive: false,
    markPrice: "4,476.2"
  },
  { 
    symbol: "BNBUSDT", 
    displayName: "BNB",
    icon: "/tokens/base.png",
    price: "1,147.8", 
    change: "0.556", 
    isPositive: true,
    markPrice: "1,148.1"
  },
  { 
    symbol: "SOLUSDT", 
    displayName: "Solana",
    icon: "/tokens/base.png",
    price: "227.26", 
    change: "3.163", 
    isPositive: false,
    markPrice: "227.35"
  },
  { 
    symbol: "WBTCUSDT", 
    displayName: "Bitcoin",
    icon: "/tokens/wbtc.png",
    price: "121,916.3", 
    change: "1.03", 
    isPositive: true,
    markPrice: "121,921.5"
  },
  { 
    symbol: "USDCUSDT", 
    displayName: "USDC",
    icon: "/tokens/usdc.png",
    price: "1.0001", 
    change: "0.01", 
    isPositive: true,
    markPrice: "1.0002"
  },
];

export default function TickerBar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A] border-t border-[#1A1A1A] z-50">
      <div className="flex items-center overflow-x-auto no-scrollbar px-4 py-2 gap-8">
        {TICKER_DATA.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 whitespace-nowrap flex-shrink-0"
          >
            {/* Token Icon & Symbol */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#F7931A] flex items-center justify-center overflow-hidden flex-shrink-0">
                <Image 
                  src={item.icon} 
                  alt={item.displayName}
                  width={24}
                  height={24}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to a colored circle if image fails to load
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-white text-xs font-semibold leading-tight">
                  {item.symbol}
                </span>
                <span className="text-[#666666] text-[10px] leading-tight">
                  {item.displayName}
                </span>
              </div>
            </div>
            
            {/* Price */}
            <span className="text-white text-sm font-medium">
              {item.price}
            </span>
            
            {/* Percentage Change */}
            <span
              className={`text-xs font-medium ${item.isPositive ? "text-[#19DE92]" : "text-[#EC5058]"}`}
            >
              {item.isPositive ? "+" : "-"}{item.change}%
            </span>
            
            {/* Mark Price */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-[#1A1A1A]">
              <span className="text-[#666666] text-[10px]">Mark</span>
              <span className="text-[#999999] text-xs">{item.markPrice}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

