import { Address } from "viem";

export type Token = {
  id: string;
  symbol: string;
  name: string;
  address: Address;
  image: string;
  decimals: number;
  displayDecimals: number;
  coingeckoName: string;
};

export const WETH: Token = {
  id: "0",
  symbol: "WETH",
  name: "Wrapped Ether",
  address: "0xB5a30b0FDc5EA94A52fDc42e3E9760Cb8449Fb37".toLowerCase() as Address,
  image: "/tokens/weth.png",
  decimals: 18,
  displayDecimals: 4,
  coingeckoName: "wrapped-ether",
};

export const USDC: Token = {
  id: "1",
  symbol: "USDC",
  name: "Circle USD",
  address: "0xf817257fed379853cDe0fa4F97AB987181B1E5Ea".toLowerCase() as Address,
  image: "/tokens/usdc.png",
  decimals: 6,
  displayDecimals: 2,
  coingeckoName: "usd-coin",
};

export const allTokens: Record<Address, Token> = {
  [WETH.address]: WETH,
  [USDC.address]: USDC,
};

export const supportedTokenPairs = [[WETH, USDC]];
