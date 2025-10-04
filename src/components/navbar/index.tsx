"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import ConnectButton from "./ConnectButton";
import ChainStatus from "./ChainStatus";
import FaucetButton from "./FaucetButton";
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogClose,
  MobileDialogContent,
} from "@/components/ui/dialog";
import { BarChart2, Layers, LayoutDashboard, BookOpen, X as CloseIcon, ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";

const NAV_ITEMS = [
  {
    title: "Perpetual",
    href: "/",
    description: "Trade perpetual options",
    disabled: false,
    icon: BarChart2,
  },
  {
    title: "1001x",
    href: "/1001x",
    description: "High leverage trading",
    disabled: true,
    icon: Layers,
  },
  {
    title: "Spot",
    href: "/spot",
    description: "Spot trading",
    disabled: true,
    icon: LayoutDashboard,
  },
  {
    title: "Portfolio",
    href: "/portfolio",
    description: "View your portfolio",
    disabled: true,
    icon: LayoutDashboard,
  },
  {
    title: "Referral",
    href: "/referral",
    description: "Referral program",
    disabled: true,
    icon: BookOpen,
  },
  {
    title: "Rewards",
    href: "/rewards",
    description: "Claim rewards",
    disabled: true,
    icon: BookOpen,
  },
  {
    title: "More",
    href: "#",
    description: "More options",
    disabled: true,
    icon: ChevronDown,
    hasDropdown: true,
  },
];

function MobileMenuButton() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          aria-label="Open menu"
          className="p-2 rounded-full bg-transparent text-white md:hidden"
          type="button"
        >
          <div className="flex flex-col items-center justify-center gap-[4px]">
            <span className="block h-[2px] w-[16px] bg-white rounded" />
            <span className="block h-[2px] w-[16px] bg-white rounded" />
          </div>
        </button>
      </DialogTrigger>
      <MobileDialogContent className="p-0 border-none w-screen h-screen max-w-screen rounded-none">
        <div className="h-full w-full bg-[#0D0D0D] overflow-hidden relative pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
          <div className="px-5 py-4 border-b border-[#1A1A1A] flex items-center justify-between">
            <span className="text-white font-semibold">Menu</span>
            <DialogClose asChild>
              <button
                aria-label="Close menu"
                type="button"
                className="p-2 rounded-full bg-transparent text-white"
              >
                <CloseIcon className="w-6 h-6" strokeWidth={2.5} />
              </button>
            </DialogClose>
          </div>
          <ul className="px-2 py-2 overflow-auto h-[calc(100%-56px)]">
            {/* Add Faucet Button to mobile menu */}
            <li className="mb-2">
              <div className="px-4 py-4">
                <FaucetButton />
              </div>
            </li>
            {NAV_ITEMS.map(({ title, href, disabled, description, icon: Icon }) => (
              <li key={title}>
                <Link
                  href={disabled ? "#" : href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-start gap-3 rounded-xl px-4 py-4",
                    disabled
                      ? "text-[#A6B0C3]/70 cursor-not-allowed"
                      : "text-white hover:bg-[#111]"
                  )}
                >
                  <div className="mt-1">
                    <Icon className="w-5 h-5 text-white/90" />
                  </div>
                  <div>
                    <div className="text-[18px] font-semibold leading-6">{title}</div>
                    {description && (
                      <div className="text-[14px] leading-6 text-[#9CA3AF]">
                        {description}
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </MobileDialogContent>
    </Dialog>
  );
}

export default function Navbar() {
  const isMobile = useIsMobile();

  return (
    <div className="w-full bg-[#0D0D0D] border-b border-[#1A1A1A]">
      <nav className="flex items-center w-full py-[12px] px-[20px]">
        {/* Left: Logo + Links */}
        <div className="flex items-center gap-[24px]">
          <Image
            src="/timelock-logo.png"
            alt="logo"
            width={100}
            height={16}
            className="md:w-[120px] md:h-[16px]"
          />
          <ul className="hidden md:flex flex-row items-center gap-[20px]">
            {NAV_ITEMS.map(({ title, href, disabled, hasDropdown }) => {
              const content = (
                <>
                  {title}
                  {hasDropdown && <ChevronDown className="w-3 h-3" />}
                </>
              );
              
              const className = cn(
                "text-sm font-normal transition-colors flex items-center gap-1",
                disabled
                  ? "text-[#666] cursor-not-allowed"
                  : title === "Perpetual"
                  ? "text-white"
                  : "text-[#999] hover:text-white"
              );

              if (disabled || href === "#") {
                return (
                  <span
                    key={title}
                    className={className}
                    title="Coming soon"
                  >
                    {content}
                  </span>
                );
              }

              return (
                <Link
                  key={title}
                  href={href}
                  className={className}
                >
                  {content}
                </Link>
              );
            })}
          </ul>
        </div>
        {/* Right: Actions */}
        <div
          className={cn(
            "flex flex-row items-center ml-auto flex-nowrap gap-3",
            isMobile 
              ? "max-w-[calc(100vw-120px)] overflow-hidden" 
              : ""
          )}
        >
          {!isMobile && <FaucetButton />}
          <ChainStatus />
          <ConnectButton />
          <MobileMenuButton />
        </div>
      </nav>
    </div>
  );
}