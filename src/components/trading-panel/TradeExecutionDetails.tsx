// import { FlashIcon } from "@/icons";
import { formatCondensed } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useSelectedTokenPair } from "@/providers/SelectedTokenPairProvider";
import { formatUnits } from "viem";

export default function TradeExecutionDetails({
  // leverage,
  premiumCost,
  protocolFee,
}: {
  leverage?: number;
  premiumCost?: bigint;
  protocolFee?: bigint;
}) {
  const { selectedTokenPair } = useSelectedTokenPair();

  return (
    <>
      {/*<TradeExecutionDetailsItem
        title={<div className="flex flex-row gap-1"><FlashIcon />Leverage</div>}
        className="pt-3 pb-[10px] text-[#1981F3] border border-[#282324]"
      >
        <span className="text-md text-[#1981F3]">
          {leverage ? leverage + "x" : "--"}
        </span> 
      </TradeExecutionDetailsItem>*/}
      
      <TradeExecutionDetailsItem
        title="Premium"
        className="pt-3 pb-[10px]"
      >
        {premiumCost
          ? formatCondensed(formatUnits(premiumCost, selectedTokenPair[1].decimals))
          : "--"}{" "}
        {selectedTokenPair[1].symbol}
      </TradeExecutionDetailsItem>
      <TradeExecutionDetailsItem
        title="Protocol Fees"
        className="pt-3 pb-[10px]"
      >
        {protocolFee
          ? formatCondensed(formatUnits(protocolFee, selectedTokenPair[1].decimals))
          : "--"}{" "}
        {selectedTokenPair[1].symbol}
      </TradeExecutionDetailsItem>
      <div className="w-full mt-5 h-[1px] bg-[#282324] transition-all duration-300 ease-in-out transform hover:bg-opacity-50"></div>
    </>
  );
}

const TradeExecutionDetailsItem = ({
  title,
  children,
  className,
}: {
  title: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) => {
  

  return (
    <div
      className={cn(
        "flex flex-row items-center justify-between gap-2 transition-all duration-300 ease-in-out transform hover:translate-x-1 hover:bg-[#282324] hover:bg-opacity-10 rounded-md p-2",
        className
      )}
    >
      <span className="text-[#9CA3AF] text-sm transition-colors duration-300 ease-in-out group-hover:text-white">{title}</span>
      <span className="text-white text-sm font-medium transition-all duration-300 ease-in-out">
        {children}
      </span>
    </div>
  );
};
