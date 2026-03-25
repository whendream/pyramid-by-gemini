import { useState, useEffect } from "react";
import { usePlanStore } from "../../store/usePlanStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2, Wand2 } from "lucide-react";
import { getSymbolStats } from "../../lib/api";
import { useHistoryStore } from "../../store/useHistoryStore";
import { calculateGrid } from "../../lib/mathLogic";

interface ConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ConfigModal({ open, onOpenChange }: ConfigModalProps) {
  const { config, updateConfig } = usePlanStore();
  const { savePlan } = useHistoryStore();
  const [symbol, setSymbol] = useState(config.symbol);
  const [budget, setBudget] = useState(config.budget.toString());
  const [price, setPrice] = useState(config.price.toString());
  const [dropRate, setDropRate] = useState(parseFloat((config.dropRate * 100).toFixed(4)).toString());
  const [ratios, setRatios] = useState(config.ratios.join(":"));
  const [isLoading, setIsLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState("");

  // Reset local state when opened to match global store
  useEffect(() => {
    if (open) {
      setSymbol(config.symbol);
      setBudget(config.budget.toString());
      setPrice(config.price.toString());
      setDropRate(parseFloat((config.dropRate * 100).toFixed(4)).toString());
      setRatios(config.ratios.join(":"));
      setAiMessage("");
    }
  }, [open, config]);

  const handleSmartCalc = async () => {
    if (!symbol) return;
    setIsLoading(true);
    setAiMessage("");
    try {
      const stats = await getSymbolStats(symbol);
      
      const gridCount = ratios.split(":").length;
      const mddDrop = Math.abs(stats.maxDrawdown) / gridCount;
      let recommendedDrop = Math.max(mddDrop, stats.atrPercent * 2);
      
      if (recommendedDrop < 0.01) recommendedDrop = 0.01;
      if (recommendedDrop > 0.40) recommendedDrop = 0.40;

      // 智能入场价：近20日高点 - 1×ATR
      const entryPrice = stats.recommendedEntry;
      const isAboveEntry = stats.lastPrice > entryPrice;

      // 如果现价已跌破入场价，说明建仓条件已满足，直接用当前价
      const actualEntry = isAboveEntry ? entryPrice : stats.lastPrice;
      setPrice(actualEntry.toString());
      setDropRate(parseFloat((recommendedDrop * 100).toFixed(4)).toString());

      const entryMsg = isAboveEntry
        ? `📍 建议在 $${entryPrice.toFixed(2)} 附近启动首次建仓（近20日高点 $${stats.recentHigh.toFixed(2)} 回落 1×ATR $${stats.atr.toFixed(2)}），当前价 $${stats.lastPrice.toFixed(2)} 尚未触及，请耐心等待。`
        : `✅ 当前价 $${stats.lastPrice.toFixed(2)} 已跌破建议入场价 $${entryPrice.toFixed(2)}（近20日高点 $${stats.recentHigh.toFixed(2)} - 1×ATR），建仓条件已满足，已为您设置当前价作为起始价！`;

      setAiMessage(`${entryMsg}\n📊 近一年最大回撤 ${(stats.maxDrawdown * 100).toFixed(1)}%，ATR ${(stats.atrPercent * 100).toFixed(1)}%，推荐每次 ${(recommendedDrop * 100).toFixed(1)}% 跌幅。`);
    } catch (err: any) {
      setAiMessage(`数据抓取失败: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    const newConfig = {
      symbol: symbol.toUpperCase() || config.symbol,
      budget: parseFloat(budget) || config.budget,
      price: parseFloat(price) || config.price,
      dropRate: isNaN(parseFloat(dropRate)) ? config.dropRate : parseFloat(dropRate) / 100,
      ratios: ratios.split(":").map(r => parseFloat(r)).filter(r => !isNaN(r)),
    };
    updateConfig(newConfig);

    // 保存到历史计划
    const { planRows, totalCost, remainBudget } = calculateGrid(
      newConfig.budget, newConfig.price, newConfig.dropRate, newConfig.ratios
    );
    savePlan(newConfig, planRows, totalCost, remainBudget);

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl p-6 border-0 shadow-2xl">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-xl font-bold text-slate-800">编辑计算参数</DialogTitle>
        </DialogHeader>
        <div className="grid gap-5">
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-bold text-slate-600">标的代码</label>
            <div className="col-span-3 flex gap-2">
              <Input className="flex-1 rounded-xl bg-slate-50 border-slate-200 h-12 px-4 shadow-none focus-visible:ring-[#3b82f6]/20 font-medium uppercase" value={symbol} onChange={e => setSymbol(e.target.value)} placeholder="QQQ" />
              <Button 
                variant="outline"
                className="h-12 px-3.5 rounded-xl border-blue-200 text-blue-600 bg-blue-50/50 hover:bg-blue-100 hover:text-blue-700 shadow-none font-bold"
                onClick={handleSmartCalc} 
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4 mr-1.5" />}
                智能测算
              </Button>
            </div>
          </div>
          {aiMessage && (
            <div className="bg-blue-50 text-blue-600 text-xs p-3 rounded-lg border border-blue-100 font-medium leading-relaxed whitespace-pre-line">
              {aiMessage}
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-bold text-slate-600">总预算 ($)</label>
            <Input className="col-span-3 rounded-xl bg-slate-50 border-slate-200 h-12 px-4 shadow-none focus-visible:ring-[#3b82f6]/20 font-medium" value={budget} onChange={e => setBudget(e.target.value)} type="number" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-bold text-slate-600">入场价格</label>
            <Input className="col-span-3 rounded-xl bg-slate-50 border-slate-200 h-12 px-4 shadow-none focus-visible:ring-[#3b82f6]/20 font-medium" value={price} onChange={e => setPrice(e.target.value)} type="number" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-bold text-slate-600">单次跌幅 (%)</label>
            <Input className="col-span-3 rounded-xl bg-slate-50 border-slate-200 h-12 px-4 shadow-none focus-visible:ring-[#3b82f6]/20 font-medium" value={dropRate} onChange={e => setDropRate(e.target.value)} type="number" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-bold text-slate-600">分配比重</label>
            <Input className="col-span-3 rounded-xl bg-slate-50 border-slate-200 h-12 px-4 shadow-none focus-visible:ring-[#3b82f6]/20 font-medium" value={ratios} onChange={e => setRatios(e.target.value)} placeholder="1:1.5:2" />
          </div>
        </div>
        <div className="flex justify-end mt-8">
          <Button onClick={handleSave} className="bg-[#3b82f6] hover:bg-blue-600 h-12 px-8 rounded-xl font-bold shadow-none">保存生效</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
