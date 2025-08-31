import { CellContext, createColumnHelper } from "@tanstack/react-table";
import { LongIcon } from "@/icons";
import { ShortIcon } from "@/icons";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Position } from "@/hooks/usePositionsTableData";
import { allTokens } from "@/lib/tokens";
import { formatUnits } from "viem";
import Big from "big.js";
import { useMarketData } from "@/context/MarketDataProvider";
import { useSelectedTokenPair } from "@/providers/SelectedTokenPairProvider";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { TRADE_EXECUTE_ABI } from "@/lib/abis/tradeExecuteAbi";
import { useEffect } from "react";
import { toast } from "sonner";
import { formatCondensed } from "@/lib/format";
import { useQueryClient } from "@tanstack/react-query";

const columnHelper = createColumnHelper<Position>();

const columns = [
  columnHelper.accessor("isCall", {
    header: "Position",
    cell: (info) => (
      <div className="pl-4 md:pl-6 py-2">
        <div
          className={cn(
            "flex items-center flex-row gap-1 md:gap-2 border px-2 md:px-[12px] py-1 md:py-[6px] rounded-md w-fit border-[#1A1A1A]",
            info.getValue() ? "text-[#16C784]" : "text-[#EC5058]",
          )}
        >
          {info.getValue() ? <LongIcon /> : <ShortIcon />}
          <div className="flex flex-col gap-[2px]">
            <div className="flex flex-row gap-1 items-center">
              <Image
                src={
                  allTokens[
                    info.row.original.callAsset?.toLowerCase() as `0x${string}`
                  ]?.image
                }
                alt={
                  allTokens[
                    info.row.original.callAsset?.toLowerCase() as `0x${string}`
                  ]?.symbol
                }
                width={12}
                height={12}
              />
              <span className="text-xs md:text-sm text-white">
                {
                  allTokens[
                    info.row.original.callAsset?.toLowerCase() as `0x${string}`
                  ]?.symbol
                }
              </span>
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
    ),
  }),
  columnHelper.accessor("amount", {
    header: "Size",
    cell: (info) => {
      const token =
        allTokens[info.row.original.callAsset?.toLowerCase() as `0x${string}`];
      const amount = info.getValue()
        ? formatUnits(BigInt(info.getValue()), token.decimals)
        : "";

      return (
        <span className="text-xs md:text-sm text-white font-semibold whitespace-nowrap">
          {amount ? formatCondensed(amount) : "0.00"} {token.symbol}
        </span>
      );
    },
  }),
  columnHelper.display({
    id: "currentPrice",
    header: "Current Price",
    cell: () => <CurrentPriceCell />,
  }),
  columnHelper.accessor("value", {
    header: "PnL",
    cell: (info) => <PnLCell info={info} />,
  }),
  columnHelper.accessor("paid", {
    header: "You Paid",
    cell: (info) => {
      const value = info.getValue();
      const decimals =
        allTokens[info.row.original.putAsset.toLowerCase() as `0x${string}`]
          .decimals;
      const symbol =
        allTokens[info.row.original.putAsset.toLowerCase() as `0x${string}`]
          .symbol;
      return (
        <span className="text-xs md:text-sm text-white font-semibold whitespace-nowrap">
          {value ? formatCondensed(formatUnits(BigInt(value), decimals)) : "--"}{" "}
          {symbol}
        </span>
      );
    },
  }),
  columnHelper.accessor("expiry", {
    header: "Expiry",
    cell: (info) => {
      const expiry = info.getValue();
      const createdAt = info.row.original.createdAt;
      const totalDuration = expiry - createdAt;
      const remaining = expiry - Math.floor(Date.now() / 1000);

      const elapsedPercentage = Math.max(
        0,
        Math.min(100, 100 - (remaining / totalDuration) * 100),
      );

      const hoursRemaining = Math.floor(remaining / 3600);
      const minutesRemaining = Math.floor((remaining % 3600) / 60);

      return (
        <div className="text-[10px] md:text-[11px] text-white/[0.5] flex flex-col gap-1">
          <span className="whitespace-nowrap">{`${hoursRemaining}h ${minutesRemaining}m`}</span>
          <div className="w-[100px] md:w-[130px] h-[8px] md:h-[10px] bg-[#1A1A1A] rounded-md relative overflow-hidden">
            <div
              className={`absolute top-0 left-0 h-full rounded-md ${
                !info.row.original.isCall ? "bg-[#EC5058]" : "bg-[#19DE92]"
              }`}
              style={{ width: `${elapsedPercentage}%` }}
            ></div>
          </div>
        </div>
      );
    },
  }),
  columnHelper.display({
    id: "actions",
    cell: (info) => (
      <div className="pr-2 md:pr-4">
        <CloseCell
          disabled={Big(info.row.original.value).lte(0)}
          optionId={info.row.original.exerciseParams?.optionId}
          swapper={info.row.original.exerciseParams?.swapper}
          swapData={info.row.original.exerciseParams?.swapData}
          liquidityToExercise={
            info.row.original.exerciseParams?.liquidityToExercise
          }
        />
      </div>
    ),
  }),
];

const PnLCell = ({ info }: { info: CellContext<Position, string> }) => {
  const { primePoolPriceData } = useMarketData();
  const value = info.getValue();
  const isCall = info.row.original.isCall;
  const putAsset =
    allTokens[info.row.original.putAsset?.toLowerCase() as `0x${string}`];
  const callAsset =
    allTokens[info.row.original.callAsset?.toLowerCase() as `0x${string}`];

  const rawPnl = isCall
    ? Big(formatUnits(BigInt(value), putAsset.decimals))
    : primePoolPriceData?.currentPrice
      ? Big(formatUnits(BigInt(value), callAsset.decimals)).mul(
          Big(primePoolPriceData.currentPrice),
        )
      : null;

  const pnl = rawPnl ? formatCondensed(rawPnl.toString()) : null;

  // Percent change relative to amount paid if available
  let percent: string | null = null;
  try {
    const paid = Big(
      formatUnits(BigInt(info.row.original.paid), putAsset.decimals),
    );
    if (rawPnl && paid.gt(0)) {
      percent = formatCondensed(rawPnl.div(paid).minus(1).mul(100).toString());
    }
  } catch {}

  return (
    <div className="flex flex-row items-center gap-1 text-[11px] md:text-[13px]">
      {Big(value).lte(0) ? (
        <div className="flex flex-row items-center gap-1 md:gap-2">
          <span className="line-through text-white/[0.5] whitespace-nowrap">
            {pnl ?? "--"}{" "}
          </span>
          <span className="whitespace-nowrap">0 USDC</span>
          <span className="underline text-white/[0.5] underline-offset-2 cursor-pointer hidden md:inline">
            How?
          </span>
        </div>
      ) : (
        <span className="text-[#19DE92] whitespace-nowrap">
          {pnl}{" "}
          {
            allTokens[info.row.original.putAsset.toLowerCase() as `0x${string}`]
              .symbol
          }
          {percent ? ` (${percent}%)` : ""}
        </span>
      )}
    </div>
  );
};

const CloseCell = ({
  optionId,
  swapper,
  swapData,
  liquidityToExercise,
  disabled,
}: {
  optionId: string;
  swapper: string[];
  swapData: string[];
  liquidityToExercise: string[];
  disabled: boolean;
}) => {
  const { isPending, writeContract, data: hash } = useWriteContract();
  const { data: executedTradeData, error } = useWaitForTransactionReceipt({
    hash: hash,
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    if (executedTradeData?.status === "success") {
      toast.success("Position Closed");
      // Refresh positions tables
      queryClient.invalidateQueries({ queryKey: ["positions"] });
      queryClient.invalidateQueries({ queryKey: ["closed-positions"] });
    }
  }, [executedTradeData, queryClient]);

  useEffect(() => {
    if (error) {
      toast.error("Position Close Failed", {
        description: "Please try again later.",
      });
    }
  }, [error]);

  const { optionMarketAddress } = useMarketData();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        if (disabled) {
          toast.error("Position cannot be closed right now. PnL < 0");
          return;
        }
        writeContract({
          address: optionMarketAddress as `0x${string}`,
          abi: TRADE_EXECUTE_ABI,
          functionName: "exerciseOption",
          args: [
            {
              optionId,
              swapper,
              swapData,
              liquidityToExercise,
            },
          ],
        });
      }}
      className={cn(
        "text-[#EC5058] transition-colors text-xs md:text-sm px-2 py-1 whitespace-nowrap",
        isPending || disabled
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer",
      )}
    >
      Close
    </button>
  );
};

const CurrentPriceCell = () => {
  const { primePoolPriceData } = useMarketData();
  const { selectedTokenPair } = useSelectedTokenPair();

  return (
    <span className="text-xs md:text-sm text-white font-semibold whitespace-nowrap">
      {primePoolPriceData?.currentPrice
        ? formatCondensed(Big(primePoolPriceData?.currentPrice).toString())
        : "--"}{" "}
      {selectedTokenPair[1].symbol}
    </span>
  );
};

export default columns;
