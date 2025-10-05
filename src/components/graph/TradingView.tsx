"use client";
import { memo } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useMarketData } from "@/context/MarketDataProvider";

export const TradingView = memo(() => {
  const { primePool } = useMarketData();
  const isMobile = useIsMobile(768);
  const isTablet = useIsMobile(1024);

  // Responsive scale factor for the entire TradingView UI
  const getScale = () => {
    if (isMobile) return 0.65; // 65% scale for mobile
    if (isTablet) return 0.75; // 75% scale for tablets
    return 0.85; // 85% scale for desktop
  };

  const SCALE = getScale();
  const compensatingPercent = `${(1 / SCALE) * 100}%`;
  
  return (
    <div className="h-full w-full overflow-hidden">
      <iframe
        id="geckoterminal-embed"
        title="GeckoTerminal Embed"
        src={`https://www.geckoterminal.com/monad-testnet/pools/${primePool}?embed=1&info=0&swaps=0&light_chart=0&chart_type=market_cap&resolution=1d&bg_color=0e0e0e`}
        frameBorder="0"
        allow="clipboard-write"
        allowFullScreen
        style={{ width: "100%", height: "100%" }}
      ></iframe>
    </div>
  );
});

TradingView.displayName = "TradingView";
