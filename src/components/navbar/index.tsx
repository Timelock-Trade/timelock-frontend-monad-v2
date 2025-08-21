"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import ConnectButton from "./ConnectButton";
import ChainStatus from "./ChainStatus";
import FaucetButton from "./FaucetButton";

const NAV_LINKS = [
  {
    title: "Trade",
    href: "/",
    disabled: false,
  },
  {
    title: "Earn",
    href: "/earn",
    disabled: true,
  },
  {
    title: "Dashboard",
    href: "/dashboard",
    disabled: true,
  },
  {
    title: "Docs",
    href: "https://docs.timelock.trade",
    disabled: false,
  },
];

export default function Navbar() {
  return (
    <div className="w-full bg-[#0D0D0D]">
      <nav className="grid grid-cols-[1fr_auto_1fr] items-center w-full mx-auto max-w-[1440px] py-[14px] px-[24px]">
        {/* TODO: Replace with text if we can */}
        <Image src="/timelock-logo.png" alt="logo" width={180} height={20} />
        <ul className="flex flex-row items-center gap-[28px] justify-self-center">
          {NAV_LINKS.map(({ title, href, disabled }) => {
            const isDocs = title === "Docs";
            return (
              <Link
                key={title}
                href={href}
                onClick={disabled ? (e) => e.preventDefault() : undefined}
                aria-disabled={disabled || undefined}
                tabIndex={disabled ? -1 : undefined}
                className={cn(
                  "text-white text-base font-medium transition-colors",
                  disabled
                    ? "text-[#A6B0C3] hover:text-[#D0D6E1]"
                    : isDocs
                    ? "text-[#A6B0C3] hover:text-[#D0D6E1]"
                    : "hover:text-[#A6B0C3]"
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
        <div
          className={cn(
            "flex flex-row items-center gap-2 w-[520px] justify-end justify-self-end"
          )}
        >
          <FaucetButton />
          <ChainStatus />
          <ConnectButton />
        </div>
      </nav>
    </div>
  );
}