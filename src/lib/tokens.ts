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

export const WMON: Token = {
  id: "2",
  symbol: "WMON",
  name: "Wrapped MON",
  address: "0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701".toLowerCase() as Address,
  image: "/tokens/wmon.png",
  decimals: 18,
  displayDecimals: 4,
  coingeckoName: "wrapped-mon",
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
  [WMON.address]: WMON,
  [USDC.address]: USDC,
};

export interface IVDataPoint {
  ttl: number;
  IV: string;
}

export const markets: Record<
  string,
  {
    primePool: string;
    ttlIV: IVDataPoint[];
    optionMarketAddress: string;
    tokens: Token[];
  }
> = {
  "weth-usdc": {
    optionMarketAddress: "0xe63844bEcC5BA7989C69ae4025667C88A72C7004".toLowerCase(),
    primePool: "0xe8781Dc41A694c6877449CEFB27cc2C0Ae9D5dbc".toLowerCase(),
    ttlIV: [
      { ttl: 60 * 15, IV: "55" },
      { ttl: 60 * 60, IV: "55" },
      { ttl: 60 * 60 * 4, IV: "55" },
      { ttl: 60 * 60 * 12, IV: "55" },
      { ttl: 60 * 60 * 24, IV: "55" },
    ],
    tokens: [WETH, USDC],
  },
  "wmon-usdc": {
    optionMarketAddress: "0x9Cc51940CeC4501f9e9A68Beb1341a0919D147C4".toLowerCase(),
    primePool: "0x7C2253A768E4AA90AFA9f9F246D8728064ee4c42".toLowerCase(),
    ttlIV: [
      { ttl: 60 * 15, IV: "55" },
      { ttl: 60 * 60, IV: "55" },
      { ttl: 60 * 60 * 4, IV: "55" },
      { ttl: 60 * 60 * 12, IV: "55" },
      { ttl: 60 * 60 * 24, IV: "55" },
    ],
    tokens: [WMON, USDC],
  },
};
