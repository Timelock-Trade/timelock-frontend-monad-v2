import { ChevronDown } from "@/icons";

function PercentChange({ value }: { value: number }) {
  return (
    <div
      className={`${value > 0 ? "text-[#10B981]" : "text-[#EC5058]"} text-xs flex flex-row items-center gap-1`}
    >
      <ChevronDown className={value > 0 ? "rotate-180" : ""} />
      {value.toFixed(2)}%
    </div>
  );
}

export default PercentChange;
