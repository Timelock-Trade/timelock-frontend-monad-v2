import { createColumnHelper } from "@tanstack/react-table";
import { ClosedPosition } from "@/hooks/useClosedPositionsData";
import { LongIcon, ShortIcon } from "@/icons";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Token } from "@/lib/tokens";
import { formatUnits } from "viem";

const columnHelper = createColumnHelper<ClosedPosition>();

const formatTs = (ts: number) => {
  try {
    return new Date(ts * 1000).toLocaleString();
  } catch {
    return "--";
  }
};

const createClosedColumns = (selectedTokenPair: Token[]) => [
  columnHelper.accessor("isCall", {
    header: "Position",
    cell: (info) => {
      const callToken = selectedTokenPair[0];
      return (
        <div className="pl-4 md:pl-6 py-2">
          <div
            className={cn(
              "flex items-center flex-row gap-1 md:gap-2 border px-2 md:px-[12px] py-1 md:py-[6px] rounded-md w-fit border-[#1A1A1A]",
              info.getValue() ? "text-[#16C784]" : "text-[#EC5058]"
            )}
          >
            {info.getValue() ? <LongIcon /> : <ShortIcon />}
            <div className="flex flex-col gap-[2px]">
              <div className="flex flex-row gap-1 items-center">
                <Image src={callToken.image} alt={callToken.symbol} width={12} height={12} />
                <span className="text-xs md:text-sm text-white">{callToken.symbol}</span>
              </div>
              <span
                className={`text-[10px] uppercase font-semibold opacity-50 ${
                  info.getValue() ? "text-[#19DE92]" : "text-[#EC5058]"
                }`}
              >
                {info.getValue() ? "Long" : "Short"}
              </span>
            </div>
          </div>
        </div>
      );
    },
  }),
  columnHelper.accessor("amount", {
    header: "Amount",
    cell: (info) => {
      const token = selectedTokenPair[0];
      const raw = info.getValue();
      const amount = raw ? formatUnits(BigInt(raw), token.decimals) : "";
      return (
        <span className="text-xs md:text-sm text-white font-semibold whitespace-nowrap">
          {amount ? Number(amount).toFixed(2) : "0.00"} {token.symbol}
        </span>
      );
    },
  }),
  columnHelper.accessor("strike", {
    header: "Strike Price",
    cell: (info) => {
      const raw = info.getValue();
      if (!raw) return <span className="text-xs md:text-sm text-white">--</span>;
      const asNumber = Number(raw) / 1e18;
      const formatted = isFinite(asNumber) ? asNumber.toFixed(2) : "--";
      // Display in quote token (assume token[1])
      return (
        <span className="text-xs md:text-sm text-white font-semibold whitespace-nowrap">
          {formatted} {selectedTokenPair[1].symbol}
        </span>
      );
    },
  }),
  columnHelper.accessor("createdAt", {
    header: "Opened",
    cell: (info) => (
      <span className="text-xs md:text-sm text-white whitespace-nowrap">{formatTs(info.getValue())}</span>
    ),
  }),
  columnHelper.accessor("expiry", {
    header: "Expired",
    cell: (info) => (
      <span className="text-xs md:text-sm text-white whitespace-nowrap">{formatTs(info.getValue())}</span>
    ),
  }),
];

export default createClosedColumns;


