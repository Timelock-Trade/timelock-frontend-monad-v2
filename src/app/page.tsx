import { getMarketIvData, getPriceData } from "@/lib/api";
import HomeClient from "./HomeClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  try {
    const [market, priceData] = await Promise.all([
      getMarketIvData(),
      getPriceData(),
    ]);
    
    const ttlIV = [...market.market.ttlIV].sort((a, b) => a.ttl - b.ttl);
    const primePoolPriceData = priceData.find(
      (price) => price.poolAddress === market.market.primePool
    );

    return (
      <HomeClient
        ttlIV={ttlIV}
        optionMarketAddress={market.market.address}
        primePool={market.market.primePool}
        primePoolPriceData={primePoolPriceData}
      />
    );
  } catch (error) {
    console.error("Error in Home component:", error);
    return (
      <div className="min-h-screen w-full bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Application</h1>
          <p className="text-gray-400">Please check the console for details</p>
          <p className="text-sm text-red-400 mt-2">{error instanceof Error ? error.message : "Unknown error"}</p>
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-blue-400">Error Details</summary>
            <pre className="text-xs mt-2 p-2 bg-gray-800 rounded overflow-auto">
              {error instanceof Error ? error.stack : JSON.stringify(error, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    );
  }
}
