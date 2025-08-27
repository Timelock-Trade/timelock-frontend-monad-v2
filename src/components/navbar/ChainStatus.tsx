import { UnsupportedIcon } from "@/icons";

import { monad } from "@/lib/chains";
import { useAccount } from "wagmi";
import { cn } from "@/lib/utils";
import { useSwitchChain } from "wagmi";
import Image from "next/image";

const ChainStatus = () => {
  const { chainId, isConnected } = useAccount();
  const { switchChain } = useSwitchChain();
  const isChainSupported = chainId === monad.chainId;

  const handleSwitchToMonad = () => {
    if (!isChainSupported && isConnected) {
      switchChain({ chainId: monad.chainId });
    }
  };

  return (
    <div
      className={cn(
        "text-sm font-medium p-2 md:px-3 md:py-3 rounded-full bg-[#131313] flex-shrink-0",
        !isConnected || isChainSupported
          ? ""
          : "cursor-pointer hover:bg-[#1a1a1a]"
      )}
      onClick={handleSwitchToMonad}
      aria-label={!isConnected || isChainSupported ? "Monad Testnet" : "Unsupported network"}
      role="button"
    >
      {!isConnected || isChainSupported ? (
        <div className="flex flex-row items-center gap-2">
          <Image src="/tokens/monad.svg" alt="Monad" width={16} height={16} />
          <span className="hidden md:inline">Monad Testnet</span>
        </div>
      ) : (
        <div className="flex flex-row items-center gap-[6px]">
          <UnsupportedIcon />
          <span className="hidden md:inline">Unsupported</span>
        </div>
      )}
    </div>
  );
};

export default ChainStatus;
