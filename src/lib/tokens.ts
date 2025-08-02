import { Address } from "viem";

export type Token = {
  id: string;
  symbol: string;
  name: string;
  address: string;
  image: string;
  decimals: number;
  displayDecimals: number;
  coingeckoName: string;
};

export const WBTC: Token = {
  id: "0",
  symbol: "WBTC",
  name: "Wrapped Bitcoin",
  address: "0xcf5a6076cfa32686c0Df13aBaDa2b40dec133F1d",
  image: "/tokens/wbtc.png",
  decimals: 18,
  displayDecimals: 4,
  coingeckoName: "wrapped-bitcoin",
};

export const USDC: Token = {
  id: "1",
  symbol: "USDC",
  name: "Circle USD",
  address: "0xf817257fed379853cDe0fa4F97AB987181B1E5Ea",
  image: "/tokens/usdc.png",
  decimals: 6,
  displayDecimals: 2,
  coingeckoName: "usd-coin",
};

export const allTokens: Record<Address, Token> = {
  [WBTC.address]: WBTC,
  [USDC.address]: USDC,
};

export const supportedTokenPairs = [[WBTC, USDC]];
