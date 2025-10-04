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
      className={`${isMobile ? "border border-[#1A1A1A] rounded-sm p-4 w-full" : "w-full max-w-[380px] border-l border-[#1A1A1A] px-4 bg-[#0D0D0D]"}`}
    >      
      <div className="flex flex-row mt-4 mb-3 gap-2 justify-between items-center w-full">
        <div className="flex-1 text-xs text-[#999]">
          Balance: {usdcBalance ? formatCondensed(usdcBalance.formatted) : '--'} USDC
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
              className="w-[316px] bg-[#1a1a1a80] border border-[#282324] backdrop-blur-xs flex flex-col gap-1 p-1 rounded-sm"
            >
              <SettingsPopoverContent />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex-1 mb-4">
        <Tabs
          value={tabValue}
          onValueChange={(value) => setTabValue(value as TabValue)}
          className="w-full"
        >
          <TabsList className="p-[3px] h-[44px] bg-[#1A1A1A] w-full rounded-sm">
            <TabsTrigger
              value={TabValue.LONG}
              className="flex-1 flex text-[#999] text-sm font-medium data-[state=active]:text-[#19DE92] cursor-pointer flex-row items-center justify-center gap-2 data-[state=active]:bg-[#19de921a] dark:data-[state=active]:bg-[#19de921a] rounded-sm"
            >
              <LongTrendIcon width={12} height={12} /> Long
            </TabsTrigger>
            <TabsTrigger
              value={TabValue.SHORT}
              className="flex-1 flex text-[#999] text-sm font-medium data-[state=active]:text-[#EC5058] cursor-pointer flex-row items-center justify-center gap-2 data-[state=active]:bg-[#ea39431a] dark:data-[state=active]:bg-[#ea39431a] rounded-sm"
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
