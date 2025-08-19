import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { formatTokenDisplayCondensed } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useSelectedTokenPair } from "@/providers/SelectedTokenPairProvider";
import { formatUnits } from "viem";

export default function TradeExecutionDetails({
  premiumCost,
  protocolFee,
}: {
  premiumCost: bigint;
  protocolFee: bigint;
}) {
  return (
    <Accordion type="single" collapsible className="min-h-[164px]">
      <AccordionItem value="item-1">
        <AccordionTrigger className="cursor-pointer text-[#9CA3AF] text-sm font-medium border border-[#282324] rounded-md px-4 bg-[#1a1a1a80]">
          Show Details
        </AccordionTrigger>
        <AccordionContent className="px-4">
          <TradeExecutionDetailsItem
            title="Premium"
            value={premiumCost}
            className="pt-3 pb-[10px]"
          />
          <TradeExecutionDetailsItem
            title="Protocol Fees"
            value={protocolFee}
            className="pb-[10px]"
          />
          <div className="w-full mt-5 h-[1px] bg-[#282324] transition-all duration-300 ease-in-out transform hover:bg-opacity-50"></div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

const TradeExecutionDetailsItem = ({
  title,
  value,
  className,
}: {
  title: string;
  value: bigint;
  className?: string;
}) => {
  const { selectedTokenPair } = useSelectedTokenPair();

  return (
    <div
      className={cn(
        "flex flex-row items-center justify-between gap-2 transition-all duration-300 ease-in-out transform hover:translate-x-1 hover:bg-[#282324] hover:bg-opacity-10 rounded-md p-2",
        className
      )}
    >
      <span className="text-[#9CA3AF] text-sm transition-colors duration-300 ease-in-out group-hover:text-white">{title}</span>
      <span className="text-white text-sm font-medium transition-all duration-300 ease-in-out">
        {value
          ? formatTokenDisplayCondensed(
            formatUnits(value, selectedTokenPair[1].decimals),
            selectedTokenPair[1].decimals
          )
          : "--"}{" "}
        {selectedTokenPair[1].symbol}
      </span>
    </div>
  );
};
