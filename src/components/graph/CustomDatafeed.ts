import {
  ErrorCallback,
  HistoryCallback,
  LibrarySymbolInfo,
  OnReadyCallback,
  ResolutionString,
} from "../../../public/static/charting_library/datafeed-api";

import { PeriodParamsWithOptionalCountback } from "../../../public/static/datafeeds/udf/src/history-provider";

export class CustomDatafeed {
  private _datafeedUrl: string;
  private _primePool: string;

  constructor(datafeedUrl: string, primePool: string) {
    this._datafeedUrl = datafeedUrl;
    this._primePool = primePool;
  }

  onReady(callback: OnReadyCallback): void {
    setTimeout(() => {
      callback({
        supported_resolutions: [
          "1",
          "5",
          "15",
          "30",
          "60",
          "1D",
        ] as ResolutionString[],
        supports_marks: false,
        supports_timescale_marks: false,
        supports_time: false,
      });
    });
  }

  searchSymbols(): void {
    // Not implemented
  }

  resolveSymbol(
    symbolName: string,
    onSymbolResolvedCallback: (symbolInfo: LibrarySymbolInfo) => void,
  ): void {
    const symbolInfo: LibrarySymbolInfo = {
      name: symbolName,
      ticker: symbolName,
      description: symbolName,
      type: "stock",
      session: "0000-2359",
      timezone: "America/New_York",
      exchange: "",
      minmov: 1,
      pricescale: 1000,
      has_intraday: true,
      has_daily: true,
      has_weekly_and_monthly: false,
      supported_resolutions: [
        "1",
        "5",
        "15",
        "30",
        "60",
        "1D",
      ] as ResolutionString[],
      volume_precision: 2,
      data_status: "streaming",
      listed_exchange: "",
      format: "price",
    };

    setTimeout(() => onSymbolResolvedCallback(symbolInfo));
  }

  getBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    periodParams: PeriodParamsWithOptionalCountback,
    onHistoryCallback: HistoryCallback,
    onErrorCallback: ErrorCallback,
  ): void {
    const params = new URLSearchParams({
      symbol: symbolInfo.ticker || symbolInfo.name,
      resolution: resolution,
      from: periodParams.from.toString(),
      to: periodParams.to.toString(),
      primePool: this._primePool,
    });

    if (periodParams.countBack !== undefined) {
      params.append("countback", periodParams.countBack.toString());
    }

    fetch(`${this._datafeedUrl}/history?${params}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.s === "no_data") {
          onHistoryCallback([], { noData: true });
        } else if (data.s === "ok") {
          const bars = data.t.map((time: number, index: number) => ({
            time: time * 1000,
            open: parseFloat(data.o[index]),
            high: parseFloat(data.h[index]),
            low: parseFloat(data.l[index]),
            close: parseFloat(data.c[index]),
            volume: data.v ? parseFloat(data.v[index]) : undefined,
          }));
          onHistoryCallback(bars, { noData: false });
        } else {
          throw new Error(data.errmsg || "Unknown error");
        }
      })
      .catch((error) => {
        console.error("Error fetching bars:", error);
        onErrorCallback(error.message);
      });
  }

  subscribeBars(): void {
    // Not implemented for real-time updates
  }

  unsubscribeBars(): void {
    // Not implemented for real-time updates
  }
}
