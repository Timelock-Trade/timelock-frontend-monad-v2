"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { WagmiProvider, createConfig, http } from "wagmi";
import { Toaster } from "sonner";
import { monad } from "@/lib/chains";
import { RPC_URL } from "@/lib/rpcs";
import { SelectedTokenPairProvider } from "./SelectedTokenPairProvider";
import { ErrorIcon, SuccessIcon } from "@/icons";

const config = createConfig(
  getDefaultConfig({
    chains: [monad],
    transports: {
      [monad.id]: http(RPC_URL),
    },
    // TODO: Create env and set this
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "",
    appName: "Timelock Trade",
    appDescription: "Timelock Trade",
    appUrl: process.env.NODE_ENV === "production" ? "https://timelock.trade" : "http://localhost:3000",
    appIcon: "/timelock-logo.png",
  })
);

const queryClient = new QueryClient();

export const Provider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <>
      <Toaster
        icons={{
          success: <SuccessIcon />,
          error: <ErrorIcon />,
        }}
        toastOptions={{
          style: {
            gap: "16px",
            background: "#171717",
            color: "#fff",
            borderRadius: "16px",
            border: "1px solid #ffffff0f",
          },
          classNames: {
            description: "toast-description",
          },
        }}
      />

      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <ConnectKitProvider theme="midnight">
            <SelectedTokenPairProvider>{children}</SelectedTokenPairProvider>
          </ConnectKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
};
