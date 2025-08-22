"use client";
import { memo, useEffect, useRef } from "react";
import { useSelectedTokenPair } from "@/providers/SelectedTokenPairProvider";

import {
  ChartingLibraryWidgetOptions,
  ResolutionString,
  widget,
} from "../../../public/static/charting_library";

export const TradingView = memo(() => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const { selectedTokenPair } = useSelectedTokenPair();

  // Scale factor for the entire TradingView UI
  const SCALE = 0.8; // e.g., 0.9 = 90% size
  const compensatingPercent = `${(1 / SCALE) * 100}%`;

  useEffect(() => {
    if (!window || !chartContainerRef.current) return;
    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: selectedTokenPair[0].symbol,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(
        "/api",
        undefined,
        {
          expectedOrder: "latestLast",
        }
      ),
      interval: "15" as ResolutionString,
      container: chartContainerRef.current,
      library_path: "/static/charting_library/",
      locale: "en",
      disabled_features: [
        // "volume_force_overlay",
        "use_localstorage_for_settings",
        "adaptive_logo",
        "charting_library_debug_mode",
        "symbol_search_hot_key",
        "save_shortcut",
        "header_symbol_search",
        "header_compare",
        "header_settings",
        "header_quick_search",
      ],
      enabled_features: [],
      charts_storage_api_version: "1.1",
      client_id: "tradingview.com",
      user_id: "public_user_id",
      fullscreen: false,
      theme: "dark",
      custom_font_family: "Arial, Helvetica, sans-serif",
      debug: false,
      custom_css_url: "/static/tradingview.css",
      time_scale: {
        min_bar_spacing: 30,
      },
      toolbar_bg: "#0D0D0D",
      loading_screen: {
        backgroundColor: "#0D0D0D",
        foregroundColor: "#fff",
      },
      autosize: true,
    };

    const tvWidget = new widget(widgetOptions);

    tvWidget.applyOverrides({
      "mainSeriesProperties.visible": true,
      // Panel
      "paneProperties.background": "#0D0D0D",
      "paneProperties.backgroundType": "solid",
      // Ensure scale labels use a visible color
      "scalesProperties.textColor": "#E5E7EB",
      "scalesProperties.fontSize": 11,
    });

    tvWidget.onChartReady(() => {});

    return () => {
      tvWidget.remove();
    };
  }, [selectedTokenPair]);

  return (
    <div className="h-full w-full overflow-hidden">
      <div
        ref={chartContainerRef}
        className="h-full w-full"
        style={{
          transform: `scale(${SCALE})`,
          transformOrigin: "top left",
          width: compensatingPercent,
          height: compensatingPercent,
        }}
      />
    </div>
  );
});

TradingView.displayName = "TradingView";