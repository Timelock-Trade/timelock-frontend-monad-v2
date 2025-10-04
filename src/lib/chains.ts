import { monadTestnet } from "viem/chains";
import { RPC_URL } from "./rpcs";

// TODO: Fix chain, rpc and block explorer urls
export const monad = {
  ...monadTestnet,
  chainId: 10143,
  id: 10143,
  rpcUrls: {
    ...monadTestnet.rpcUrls,
    default: {
      ...monadTestnet.rpcUrls.default,
      http: [RPC_URL],
    },
  },
  blockExplorers: {
    ...monadTestnet.blockExplorers,
    default: {
      ...monadTestnet.blockExplorers.default,
      name: "MonadScan",
      url: "https://explorer.testnet.monad.xyz",
      apiUrl: "https://api.blockvision.org/v2/monad/account/tokens",
    },
  },
};
