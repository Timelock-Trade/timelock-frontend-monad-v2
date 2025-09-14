"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LongTrendIcon, SettingsIcon, ShortTrendIcon } from "@/icons";
import { useState } from "react";
import TradingForm from "./TradingForm";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SettingsPopoverContent } from "./Settings";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useAccount, useBalance } from "wagmi";
import { USDC } from "@/lib/tokens";
import { formatCondensed } from "@/lib/format";

enum TabValue {
  LONG = "long",
  SHORT = "short",
}

export default function TradingPanel() {
  const [tabValue, setTabValue] = useState(TabValue.LONG);
  const isMobile = useIsMobile(768);

  const {address} = useAccount();
  const {data: usdcBalance} = useBalance({token: USDC.address, address});

  return (
    <div
      className={`${isMobile ? "border border-[#1A1A1A] rounded-md p-4 w-full" : "w-full max-w-[400px] border-l border-[#1A1A1A] px-5"}`}
    >      
      <div className="flex flex-row mt-6 mb-4 px-2 gap-2 justify-center align-middle w-full">
        <div className="flex-1 text-sm text-[#9CA3AF]">
          Your Balance: {usdcBalance ? formatCondensed(usdcBalance.formatted) : '--'} USDC
        </div>
        <div>
          <Popover>
            <PopoverTrigger className="cursor-pointer">
              <SettingsIcon />
            </PopoverTrigger>
            <PopoverContent
              side="top"
              align="end"
              sideOffset={10}
              className="w-[316px] bg-[#1a1a1a80] border border-[#282324] backdrop-blur-xs flex flex-col gap-1 p-1"
            >
              <SettingsPopoverContent />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex-1 mb-6">
        <Tabs
          value={tabValue}
          onValueChange={(value) => setTabValue(value as TabValue)}
          className="w-full"
        >
          <TabsList className="p-[6px] h-[54px] bg-[#1a1a1a80] w-full">
            <TabsTrigger
              value={TabValue.LONG}
              className="flex-1 flex text-[#616E85] font-medium data-[state=active]:text-[#19DE92] cursor-pointer flex-row items-center justify-center gap-2 data-[state=active]:bg-[#19de920f] dark:data-[state=active]:bg-[#19de920f]"
            >
              <LongTrendIcon width={12} height={12} /> Long
            </TabsTrigger>
            <TabsTrigger
              value={TabValue.SHORT}
              className="flex-1 flex text-[#616E85] font-medium data-[state=active]:text-[#EC5058] cursor-pointer flex-row items-center justify-center gap-2 data-[state=active]:bg-[#ea39430f] dark:data-[state=active]:bg-[#ea39430f]"
            >
              <ShortTrendIcon width={12} height={12} /> Short
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    
      <TradingForm isLong={tabValue === TabValue.LONG} />
    </div>
  );
}
