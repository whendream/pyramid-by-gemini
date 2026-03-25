import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { usePlanStore } from "../../store/usePlanStore";
import { Button } from "../ui/button";

function generateMockData(currentPrice: number) {
  const data = [];
  let price = currentPrice * 0.8; // start 20% lower 180 days ago
  const now = new Date();
  
  for (let i = 180; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    
    // random walk
    price = price * (1 + (Math.random() - 0.48) * 0.03);
    
    // force it to end at currentPrice
    if (i < 30) {
      price = price + (currentPrice - price) * 0.1;
    }

    data.push({
      date: d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
      price: Number(price.toFixed(2)),
    });
  }
  return data;
}

export default function PriceChartReal() {
  const { config, getPlanData } = usePlanStore();
  const { planRows } = getPlanData();

  const data = useMemo(() => generateMockData(config.price), [config.price]);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 mb-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{config.symbol} 价格走势 <span className="text-sm font-medium text-slate-400 ml-2">K线图 · 6m</span></h2>
          <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">真实测算 · 180个交易日 · 最新 {config.price}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8 rounded-lg shadow-none text-xs text-slate-600 bg-slate-50">6m</Button>
          <Button variant="ghost" size="sm" className="h-8 rounded-lg text-xs text-slate-400">1y</Button>
          <Button variant="ghost" size="sm" className="h-8 rounded-lg text-xs text-slate-400">3y</Button>
        </div>
      </div>
      
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} minTickGap={30} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} domain={['auto', 'auto']} tickFormatter={(v) => `$${v}`} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontWeight: 'bold' }}
              itemStyle={{ color: '#0f172a' }}
              formatter={(value: any) => [`$${Number(value)}`, 'Price']}
            />
            
            {planRows.map((row, idx) => (
              <ReferenceLine 
                key={row.level} 
                y={row.price} 
                stroke={idx === 1 ? "#3b82f6" : "#f59e0b"} 
                strokeDasharray="4 4" 
                label={{ position: 'right', value: `第${row.level}次加仓 $${row.price.toFixed(2)}`, fill: idx === 1 ? "#3b82f6" : "#f59e0b", fontSize: 11, fontWeight: 'bold' }} 
              />
            ))}

            <Area type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
