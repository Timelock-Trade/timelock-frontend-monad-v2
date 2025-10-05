"use client";

import { FaucetIcon } from "@/icons";
import { cn } from "@/lib/utils";
/**
 * Deprecated: old faucet mint logic disabled. Keeping for reference.
 *
 * const { address } = useAccount();
 * const handleMint = async () => {
 *   if (!address) {
 *     toast.error("Please connect your wallet first");
 *     return;
 *   }
 *   try {
 *     setIsLoading(true);
 *     const response = await fetch("/api/faucet", {
 *       method: "POST",
 *       headers: { "Content-Type": "application/json" },
 *       body: JSON.stringify({ recipient: address }),
 *     });
 *     const data = await response.json();
 *     if (!response.ok) {
 *       throw new Error(data.message || "Failed to mint tokens");
 *     }
 *     toast.success("Tokens minted successfully");
 *     setIsDialogOpen(false);
 *   } catch (error: unknown) {
 *     console.error("Faucet error:", error);
 *     const errorMessage =
 *       error instanceof Error ? error.message : "Failed to mint tokens";
 *     toast.error(errorMessage);
 *   } finally {
 *     setIsLoading(false);
 *   }
 * };
 */

const FaucetButton = ({ showTextOnMobile = false }: { showTextOnMobile?: boolean }) => {
  return (
    <>
      <a
        href="https://faucet.monad.xyz/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Mint"
        className={cn(
          "text-sm font-medium p-2 md:px-3 md:py-3 rounded-full bg-[#131313]",
          "cursor-pointer hover:bg-[#1a1a1a] disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        <div className="flex flex-row items-center gap-2">
          <FaucetIcon />
          <span className={cn(showTextOnMobile ? "inline" : "hidden md:inline")}>Mint</span>
        </div>
      </a>
    </>
  );
};

export default FaucetButton;
