import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Token } from "@/lib/tokens";
// no truncation in this modal per requirement
import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";
import { Dispatch, SetStateAction, useMemo } from "react";
import { formatUnits } from "viem";
import Big from "big.js";

export function YouPayInfoDialog({
  isOpen,
  setIsOpen,
  premiumCost,
  protocolFee,
  totalCost,
  leverage,
  callAsset,
  putAsset,
  amount,
  currentPrice,
  isLong,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  premiumCost: bigint | undefined;
  protocolFee: bigint | undefined;
  totalCost: bigint | undefined;
  leverage: string | null;
  callAsset: Token;
  putAsset: Token;
  amount: string; // raw input amount in callAsset units for long, putAsset units for short
  currentPrice: string | null; // in putAsset terms per 1 callAsset
  isLong: boolean;
}) {
  // Derived display strings (no truncation)
  const totalStr = totalCost !== undefined ? formatUnits(totalCost, putAsset.decimals) : "--";

  // Notional value estimation (in put asset terms)
  const notional = useMemo(() => {
    if (!amount) return null;
    if (isLong) {
      if (!currentPrice) return null;
      try {
        return Big(amount).mul(Big(currentPrice)).toString();
      } catch {
        return null;
      }
    }
    // For shorts, amount is already in put asset terms
    return amount;
  }, [amount, currentPrice, isLong]);

  const notionalStr = notional ?? "--";

  const leverageNum = useMemo(() => {
    if (!leverage) return null;
    try {
      return Big(leverage);
    } catch {
      return null;
    }
  }, [leverage]);

  const leverageStr = leverage ?? "--";

  const margin = useMemo(() => {
    if (!notional || !leverageNum || leverageNum.eq(0)) return null;
    try {
      return Big(notional).div(leverageNum).toString();
    } catch {
      return null;
    }
  }, [notional, leverageNum]);

  const marginStr = margin ?? "--";

  // Breakdown numbers (no truncation)
  const premiumStr = premiumCost !== undefined ? formatUnits(premiumCost, putAsset.decimals) : "--";
  const feeStr = protocolFee !== undefined ? formatUnits(protocolFee, putAsset.decimals) : "--";
  const bufferStr = useMemo(() => {
    try {
      if (totalCost === undefined || premiumCost === undefined || protocolFee === undefined) return "--";
      const t = Big(formatUnits(totalCost, putAsset.decimals));
      const p = Big(formatUnits(premiumCost, putAsset.decimals));
      const f = Big(formatUnits(protocolFee, putAsset.decimals));
      return t.minus(p).minus(f).toString();
    } catch {
      return "--";
    }
  }, [totalCost, premiumCost, protocolFee, putAsset.decimals]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="!max-w-[360px]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>You Pay details</DialogTitle>
          <DialogClose className="cursor-pointer">
            <XIcon className="w-4 h-4" />
          </DialogClose>
        </DialogHeader>
        <div className="grid gap-2 py-2">
          <Row label="Notional" value={`${notionalStr} ${putAsset.symbol}`} strong />
          <Row label="Leverage" value={`${leverageStr}x`} strong />
          <Row label="Computed margin (notional ÷ leverage)" value={`${marginStr} ${putAsset.symbol}`} strong />
          {/* <div className="border-t border-[#1A1A1A] my-1" />
          <Row label="Premium" value={`${premiumStr} ${putAsset.symbol}`} />
          <Row label="Protocol fee" value={`${feeStr} ${putAsset.symbol}`} />
          <Row label="Buffer" value={`${bufferStr} ${putAsset.symbol}`} /> */}
          <div className="border-t border-[#1A1A1A] my-1" />
          <Row label="You Pay (charged now)" value={`${totalStr} ${putAsset.symbol}`} strong />
        </div>
        <div className="mt-2 text-xs text-[#9CA3AF] leading-relaxed">
          Margin = Notional ÷ Leverage → {notionalStr} ÷ {leverageStr} = {marginStr} {putAsset.symbol}.
        </div>
        <DialogFooter>
          <div className="w-full text-[11px] text-[#616E85] text-center">
            Values are estimates and may vary with price and liquidity.
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value, strong, subtle }: { label: string; value: string; strong?: boolean; subtle?: boolean }) {
  return (
    <div className="flex flex-row items-center justify-between">
      <span className={cn("text-sm", subtle ? "text-[#616E85]" : "text-[#9CA3AF]")}>{label}</span>
      <span className={cn("text-sm", strong ? "text-white font-semibold" : "text-white")}>{value}</span>
    </div>
  );
} 