import { parseStooqCSV, calculateATR, calculateMaxDrawdown } from "./indicators";

interface SymbolStats {
  symbol: string;
  atr: number;
  atrPercent: number;
  maxDrawdown: number;
  lastPrice: number;
  recentHigh: number;
  recommendedEntry: number;
  timestamp: number;
}

const CACHE_PREFIX = "stooq_cache_";
const CACHE_TTL = 12 * 60 * 60 * 1000; // 12 hours

export async function getSymbolStats(symbol: string): Promise<SymbolStats> {
  const cacheKey = `${CACHE_PREFIX}${symbol.toUpperCase()}`;
  const cached = localStorage.getItem(cacheKey);
  
  if (cached) {
    try {
      const parsed: SymbolStats = JSON.parse(cached);
      // 确保缓存数据包含所有必要字段（兼容旧版本缓存）
      if (
        Date.now() - parsed.timestamp < CACHE_TTL &&
        parsed.recentHigh !== undefined &&
        parsed.recommendedEntry !== undefined
      ) {
        console.log(`[Stooq] Using cached data for ${symbol}`);
        return parsed;
      }
    } catch (e) {
      console.warn("Failed to parse cache", e);
    }
  }
  
  console.log(`[Stooq] Fetching fresh data for ${symbol}`);
  // CORS proxy to fetch stooq CSV openly
  const stooqUrl = `https://stooq.com/q/d/l/?s=${symbol.toUpperCase()}.US&i=d`;
  const proxyUrl = `https://corsproxy.io/?url=${encodeURIComponent(stooqUrl)}`;
  
  const res = await fetch(proxyUrl);
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  const csv = await res.text();
  
  const bars = parseStooqCSV(csv);
  if (bars.length < 2) {
    throw new Error("Invalid or empty historical data returned by Stooq for symbol: " + symbol);
  }
  
  // 截取过去 252 个交易日 (约 1 年)
  const recentBars = bars.slice(-252);
  
  const atr = calculateATR(recentBars, 14);
  const maxDrawdown = calculateMaxDrawdown(recentBars);
  const lastPrice = recentBars[recentBars.length - 1].close;
  const atrPercent = atr / lastPrice;

  // 近 20 个交易日最高价
  const recent20 = recentBars.slice(-20);
  const recentHigh = Math.max(...recent20.map(b => b.high));
  // 建议入场价 = 近期高点 - 1×ATR
  const recommendedEntry = parseFloat((recentHigh - atr).toFixed(2));
  
  const stats: SymbolStats = {
    symbol: symbol.toUpperCase(),
    atr,
    atrPercent,
    maxDrawdown,
    lastPrice,
    recentHigh,
    recommendedEntry,
    timestamp: Date.now()
  };
  
  localStorage.setItem(cacheKey, JSON.stringify(stats));
  return stats;
}
