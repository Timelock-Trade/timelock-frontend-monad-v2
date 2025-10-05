// import Big from "big.js";
import { NextResponse } from "next/server";

const TIMEFRAME_MAP = {
  1: "1d",
  5: "5d",
  15: "15d",
  30: '1m',
  90: '1m',
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const primePool = searchParams.get("primePool");

    if (!from || !to || !primePool) {
      return new Response(`Pass from, to, and primePool parameters`, {
        status: 400,
      });
    }
    const resolution = parseInt(searchParams.get("resolution")!);
    const symbol = searchParams.get("symbol");

    console.log(resolution);
    const timeframe = TIMEFRAME_MAP[resolution as keyof typeof TIMEFRAME_MAP];

    if (!resolution || !symbol) {
      return new Response(`Pass resolution and symbol`, {
        status: 400,
      });
    }
    if (!timeframe) {
      return NextResponse.json(
        { error: "Missing required parameters: timeframe" },
        { status: 400 },
      );
    }
    // const validTimeframes = ["1m", "1h", "1d"];

    // if (!validTimeframes.includes(timeframe)) {
    //   return NextResponse.json(
    //     { error: "Invalid timeframe. Must be one of: day, hour, minute" },
    //     { status: 400 },
    //   );
    // }
    console.log(
      `${process.env.NEXT_PUBLIC_OHLC_BACKEND}/ohlc/${primePool}?from=${from}&to=${to}&interval=${timeframe}`,
    );
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_OHLC_BACKEND}/ohlc/${primePool}?from=${from}&to=${to}&interval=${timeframe}`,
      {
        headers: { accept: "application/json" },
      },
    );
    // const response = await fetch(
    //   `https://api.geckoterminal.com/api/v2/networks/monad-testnet/pools/${primePool}/ohlcv/${converted[timeframe]!}?before_timestamp=${to}&limit=${limit}`,
    //   {
    //     headers: { accept: "application/json" },
    //   },
    // );
    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error }, { status: response.status });
    }
    const data = (await response.json()).data;

    let status = "ok";

    if (data.length === 0) {
      status = "no_data";
    }
    const t = [];
    const o = [];
    const h = [];
    const l = [];
    const c = [];
    // const v = [];

    for (const _data of data) {
      t.push(_data[0]);
      o.push(_data[1]);
      h.push(_data[2]);
      l.push(_data[3]);
      c.push(_data[4]);
      // v.push(Big(_data[6]).div(1e6));
    }

    const barsRes = {
      t: t,
      o: o,
      h: h,
      l: l,
      c: c,
      // v: v,
      s: status,
    };

    return NextResponse.json(barsRes);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: error || "Internal server error" },
      { status: 500 },
    );
  }
}
