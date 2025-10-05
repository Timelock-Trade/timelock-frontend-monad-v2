"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import ConnectButton from "./ConnectButton";
import ChainStatus from "./ChainStatus";
import FaucetButton from "./FaucetButton";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Dialog,
  DialogTrigger,
  DialogClose,
  MobileDialogContent,
} from "@/components/ui/dialog";
import { BarChart2, Layers, LayoutDashboard, BookOpen, X as CloseIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { FaucetIcon } from "@/icons";

const NAV_ITEMS = [
  {
    title: "Trade",
    href: "/",
    description: "Trade options with clear pricing and execution",
    disabled: false,
    icon: BarChart2,
  },
  {
    title: "Earn",
    href: "/earn",
    description: "Provide liquidity and earn market fees",
    disabled: false,
    icon: Layers,
  },
  {
    title: "Dashboard",
    href: "/dashboard",
    description: "Track portfolio, positions and PnL",
    disabled: true,
    icon: LayoutDashboard,
  },
  {
    title: "Docs",
    href: "https://docs.timelock.trade",
    description: "Read protocol, guides and API",
    disabled: false,
    icon: BookOpen,
  },
];

function MobileMenuButton() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  
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
            <li>
              <a
                href="https://faucet.monad.xyz/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 rounded-xl px-4 py-4 text-[#A6B0C3] hover:text-white hover:bg-[#111]"
              >
                <div className="mt-1">
                  <FaucetIcon />
                </div>
                <div>
                  <div className="text-[18px] font-semibold leading-6">Mint</div>
                  <div className="text-[14px] leading-6 text-[#9CA3AF]">
                    Get testnet tokens from faucet
                  </div>
                </div>
              </a>
            </li>
            {NAV_ITEMS.map(({ title, href, disabled, description, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <li key={title}>
                  <Link
                    href={disabled ? "#" : href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-start gap-3 rounded-xl px-4 py-4",
                      disabled
                        ? "text-[#A6B0C3]/70 cursor-not-allowed"
                        : isActive
                        ? "text-white bg-[#111]"
                        : "text-[#A6B0C3] hover:text-white hover:bg-[#111]"
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
              );
            })}
          </ul>
        </div>
      </MobileDialogContent>
    </Dialog>
  );
}

export default function Navbar() {
  const isMobile = useIsMobile();
  const pathname = usePathname();

  return (
    <div className="w-full bg-[#0D0D0D]">
      <nav className="flex items-center w-full mx-auto max-w-[1440px] py-[14px] px-[24px]">
        {/* Left: Logo + Links */}
        <div className="flex items-center gap-[28px]">
          {/* TODO: Replace with text if we can */}
          <Image
            src="/timelock-logo.png"
            alt="logo"
            width={140}
            height={18}
            className="md:w-[180px] md:h-[20px]"
          />
          <ul className="hidden md:flex flex-row items-center gap-[28px]">
            {NAV_ITEMS.map(({ title, href, disabled }) => {
              const isDocs = title === "Docs";
              const isActive = pathname === href;
              return (
                <Link
                  key={title}
                  href={href}
                  onClick={disabled ? (e: React.MouseEvent) => e.preventDefault() : undefined}
                  aria-disabled={disabled || undefined}
                  tabIndex={disabled ? -1 : undefined}
                  className={cn(
                    "text-base font-medium transition-colors",
                    disabled
                      ? "text-[#A6B0C3] hover:text-[#D0D6E1]"
                      : isDocs
                      ? "text-[#A6B0C3] hover:text-[#D0D6E1]"
                      : isActive
                      ? "text-white"
                      : "text-[#A6B0C3] hover:text-white"
                  )}
                  title={disabled ? "Coming soon" : undefined}
                  target={isDocs ? "_blank" : undefined}
                  rel={isDocs ? "noopener noreferrer" : undefined}
                >
                  {title}
                </Link>
              );
            })}
          </ul>
        </div>
        {/* Right: Actions */}
        <div
          className={cn(
            "flex flex-row items-center ml-auto flex-nowrap",
            isMobile 
              ? "gap-1 max-w-[calc(100vw-120px)] overflow-hidden" 
              : "gap-2 md:w-[520px] md:justify-end"
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