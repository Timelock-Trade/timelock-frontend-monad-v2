export interface PriceData {
  currentPrice: number;
  percentChange: number;
  poolAddress: string;
  timestamp: number;
}

export async function getPriceData(poolAddress: string): Promise<PriceData> {
  const apiUrl = process.env.NEXT_PUBLIC_OHLC_BACKEND;

  const response = await fetch(`${apiUrl}/price/${poolAddress.toLowerCase()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}
