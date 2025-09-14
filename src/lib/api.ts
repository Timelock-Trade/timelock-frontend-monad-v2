export interface PriceData {
  currentPrice: number;
  percentChange: number;
  poolAddress: string;
  timestamp: number;
}

export async function getPriceData(): Promise<PriceData[]> {
  const apiUrl = process.env.NEXT_PUBLIC_OHLC_BACKEND;

  try {
    const response = await fetch(`${apiUrl}/prices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data?.results;
  } catch (error) {
    console.error("Error fetching price data:", error);
    throw error;
  }
}
