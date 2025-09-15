import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, Download, Share2 } from "lucide-react";
import { Position } from "@/hooks/usePositionsTableData";
import { allTokens } from "@/lib/tokens";
import { formatUnits } from "viem";
import Big from "big.js";
import { formatCondensed } from "@/lib/format";
import { useMarketData } from "@/context/MarketDataProvider";

interface SharePnLModalProps {
  isOpen: boolean;
  onClose: () => void;
  position: Position;
}

const cardBackgrounds = [
  { id: 1, gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { id: 2, gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
  { id: 3, gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
  { id: 4, gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" },
  { id: 5, gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" },
  { id: 6, gradient: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)" },
  { id: 7, gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" },
  { id: 8, gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)" },
];

export default function SharePnLModal({
  isOpen,
  onClose,
  position,
}: SharePnLModalProps) {
  const [selectedBg, setSelectedBg] = useState(cardBackgrounds[0]);
  const cardRef = useRef<HTMLDivElement>(null);
  const { primePoolPriceData } = useMarketData();

  if (!position) return null;

  const putAsset = allTokens[position.putAsset?.toLowerCase() as `0x${string}`];
  const callAsset =
    allTokens[position.callAsset?.toLowerCase() as `0x${string}`];

  const rawPnl = position.isCall
    ? Big(formatUnits(BigInt(position.value), putAsset.decimals))
    : primePoolPriceData?.currentPrice
      ? Big(formatUnits(BigInt(position.value), callAsset.decimals)).mul(
          Big(primePoolPriceData.currentPrice),
        )
      : null;

  const pnl = rawPnl ? formatCondensed(rawPnl.toString()) : "0";
  const isProfitable = Big(position.value).gt(0);

  let percentChange: string | null = null;
  try {
    const paid = Big(formatUnits(BigInt(position.paid), putAsset.decimals));
    if (rawPnl && paid.gt(0)) {
      percentChange = formatCondensed(rawPnl.div(paid).mul(100).toString());
    }
  } catch {}

  const handleShareToX = () => {
    const text = isProfitable
      ? `Just made ${pnl} ${putAsset.symbol} (${percentChange ? `+${percentChange}%` : ""}) on @timelock_xyz! 🚀`
      : `Trading on @timelock_xyz with advanced options strategies! 📈`;

    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const handleDownloadPNG = async () => {
    if (!cardRef.current) return;

    try {
      // Custom canvas implementation - most reliable approach
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Set canvas size for high DPI
      const scale = 2;
      const width = 500;
      const height = 280; // 16:9 aspect ratio approximately
      canvas.width = width * scale;
      canvas.height = height * scale;
      ctx.scale(scale, scale);

      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height);

      // Parse the gradient from selectedBg
      if (selectedBg.id === 1) {
        gradient.addColorStop(0, "#667eea");
        gradient.addColorStop(1, "#764ba2");
      } else if (selectedBg.id === 2) {
        gradient.addColorStop(0, "#f093fb");
        gradient.addColorStop(1, "#f5576c");
      } else if (selectedBg.id === 3) {
        gradient.addColorStop(0, "#4facfe");
        gradient.addColorStop(1, "#00f2fe");
      } else if (selectedBg.id === 4) {
        gradient.addColorStop(0, "#43e97b");
        gradient.addColorStop(1, "#38f9d7");
      } else if (selectedBg.id === 5) {
        gradient.addColorStop(0, "#fa709a");
        gradient.addColorStop(1, "#fee140");
      } else if (selectedBg.id === 6) {
        gradient.addColorStop(0, "#30cfd0");
        gradient.addColorStop(1, "#330867");
      } else if (selectedBg.id === 7) {
        gradient.addColorStop(0, "#a8edea");
        gradient.addColorStop(1, "#fed6e3");
      } else if (selectedBg.id === 8) {
        gradient.addColorStop(0, "#ff9a9e");
        gradient.addColorStop(1, "#fecfef");
      }

      ctx.fillStyle = gradient;

      // Draw rounded rectangle
      ctx.beginPath();
      ctx.roundRect(0, 0, width, height, 12);
      ctx.fill();

      // Draw "Timelock Options" text
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.font =
        "14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.fillText("Timelock Options", 24, 40);

      // Draw main PnL text
      ctx.fillStyle = isProfitable ? "#ffffff" : "rgba(255, 255, 255, 0.7)";
      ctx.font =
        "bold 32px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      const pnlText = `${isProfitable ? "+" : ""}${pnl} ${putAsset.symbol}`;
      ctx.fillText(pnlText, 24, 85);

      // Draw percentage if profitable
      if (percentChange && isProfitable) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.font =
          "18px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        ctx.fillText(`+${percentChange}%`, 24, 115);
      }

      // Draw LONG/SHORT badge
      const badgeText = position.isCall ? "LONG" : "SHORT";
      const badgeWidth = ctx.measureText(badgeText).width + 24;
      const badgeX = width - badgeWidth - 24;
      const badgeY = 24;

      // Badge background
      ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeWidth, 28, 14);
      ctx.fill();

      // Badge text
      ctx.fillStyle = "#ffffff";
      ctx.font =
        "14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.fillText(badgeText, badgeX + 12, badgeY + 18);

      // Draw asset info at bottom
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.font =
        "16px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.fillText(callAsset.symbol, 24, height - 40);

      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.font =
        "14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      const sizeText = `Size: ${formatCondensed(
        formatUnits(BigInt(position.amount), callAsset.decimals),
      )} ${callAsset.symbol}`;
      ctx.fillText(sizeText, 24, height - 18);

      // Convert to data URL and download
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `timelock-pnl-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className=" bg-[#0A0A0A] border border-[#1A1A1A] text-white p-0 !max-w-[1024px] w-[1024px]">
        <DialogHeader className="p-6 pb-0">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-bold">
              Share Your PnL
            </DialogTitle>
            <button
              onClick={onClose}
              className="text-white/50 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-6 p-6">
          {/* Preview Section */}
          <div className="flex-1">
            <div className="text-sm text-white/50 mb-3">Preview</div>
            <div
              ref={cardRef}
              className="relative w-full aspect-[16/9] rounded-xl overflow-hidden p-6 flex flex-col justify-between"
              style={{
                background: selectedBg.gradient,
                color: "#ffffff",
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div
                    className="text-sm font-medium mb-1"
                    style={{ color: "rgba(255, 255, 255, 0.9)" }}
                  >
                    Timelock Options
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-3xl font-bold"
                      style={{
                        color: "#ffffff",
                        opacity: !isProfitable ? 0.7 : 1,
                      }}
                    >
                      {isProfitable ? "+" : ""}
                      {pnl} {putAsset.symbol}
                    </span>
                  </div>
                  {percentChange && isProfitable && (
                    <div
                      className="text-lg mt-1"
                      style={{ color: "rgba(255, 255, 255, 0.8)" }}
                    >
                      +{percentChange}%
                    </div>
                  )}
                </div>
                <div
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(10px)",
                    color: "#ffffff",
                  }}
                >
                  {position.isCall ? "LONG" : "SHORT"}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <img
                    src={callAsset.image}
                    alt={callAsset.symbol}
                    className="w-6 h-6 rounded-full"
                  />
                  <span
                    className="font-medium"
                    style={{ color: "rgba(255, 255, 255, 0.9)" }}
                  >
                    {callAsset.symbol}
                  </span>
                </div>
                <div
                  className="text-sm"
                  style={{ color: "rgba(255, 255, 255, 0.7)" }}
                >
                  Size:{" "}
                  {formatCondensed(
                    formatUnits(BigInt(position.amount), callAsset.decimals),
                  )}{" "}
                  {callAsset.symbol}
                </div>
              </div>
            </div>
          </div>

          {/* Controls Section */}
          <div className="w-full md:w-72 space-y-6">
            {/* Background Selection */}
            <div>
              <div className="text-sm text-white/50 mb-3">Card Background</div>
              <div className="grid grid-cols-4 gap-2">
                {cardBackgrounds.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => setSelectedBg(bg)}
                    className={`w-full aspect-square rounded-lg transition-all ${
                      selectedBg.id === bg.id
                        ? "ring-2 ring-white ring-offset-2 ring-offset-[#0A0A0A]"
                        : ""
                    }`}
                    style={{ background: bg.gradient }}
                  />
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleShareToX}
                className="w-full bg-white text-black py-3 px-4 rounded-lg font-medium hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share to X
              </button>
              <button
                onClick={handleDownloadPNG}
                className="w-full bg-[#1A1A1A] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#252525] transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Save PNG
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
