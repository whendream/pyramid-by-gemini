export interface Bar {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// 解析 Stooq CSV (Date,Open,High,Low,Close,Volume)
export function parseStooqCSV(csv: string): Bar[] {
  const lines = csv.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return [];
  
  // 第0行是Header: Date,Open,High,Low,Close,Volume
  const bars: Bar[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',');
    if (cols.length >= 6) {
      bars.push({
        date: cols[0],
        open: parseFloat(cols[1]),
        high: parseFloat(cols[2]),
        low: parseFloat(cols[3]),
        close: parseFloat(cols[4]),
        volume: parseFloat(cols[5])
      });
    }
  }
  return bars;
}

export function calculateATR(bars: Bar[], period = 14): number {
  if (bars.length < period + 1) return 0;
  
  let trSum = 0;
  // 计算前period天的TR
  for (let i = 1; i <= period; i++) {
    const current = bars[i];
    const prev = bars[i - 1];
    const hl = current.high - current.low;
    const hc = Math.abs(current.high - prev.close);
    const lc = Math.abs(current.low - prev.close);
    const tr = Math.max(hl, hc, lc);
    trSum += tr;
  }
  
  let atr = trSum / period;
  
  // 平滑计算剩下的天数
  for (let i = period + 1; i < bars.length; i++) {
    const current = bars[i];
    const prev = bars[i - 1];
    const hl = current.high - current.low;
    const hc = Math.abs(current.high - prev.close);
    const lc = Math.abs(current.low - prev.close);
    const tr = Math.max(hl, hc, lc);
    atr = (atr * (period - 1) + tr) / period;
  }
  
  return atr;
}

export function calculateMaxDrawdown(bars: Bar[]): number {
  if (bars.length === 0) return 0;
  
  let peak = bars[0].close;
  let maxDrawdown = 0;
  
  for (let i = 1; i < bars.length; i++) {
    const close = bars[i].close;
    if (close > peak) {
      peak = close;
    }
    const drawdown = (close / peak) - 1;
    if (drawdown < maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }
  
  return maxDrawdown;
}
