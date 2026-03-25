import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Star, Plus, Edit2, Trash2, GripVertical, Loader2, Check, X } from "lucide-react";
import { useWatchListStore } from "../../store/useWatchListStore";
import { usePlanStore } from "../../store/usePlanStore";
import { getSymbolStats } from "../../lib/api";

export default function WatchList() {
  const { stocks, activeStockId, addStock, removeStock, updateStock, setActiveStock } = useWatchListStore();
  const { updateConfig } = usePlanStore();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newSymbol, setNewSymbol] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState("");

  // Inline edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSymbol, setEditSymbol] = useState("");

  // 添加股票: 拉取 Stooq 获取最新价
  const handleAdd = async () => {
    if (!newSymbol.trim()) return;
    setIsAdding(true);
    setAddError("");
    try {
      const stats = await getSymbolStats(newSymbol.trim());
      addStock(newSymbol.trim(), stats.lastPrice);
      // 同步更新计算器
      updateConfig({ symbol: newSymbol.trim().toUpperCase(), price: stats.lastPrice });
      setNewSymbol("");
      setShowAddDialog(false);
    } catch (err: any) {
      setAddError(`获取失败: ${err.message}`);
    } finally {
      setIsAdding(false);
    }
  };

  // 选中股票: 联动计算器
  const handleSelect = async (stock: typeof stocks[0]) => {
    setActiveStock(stock.id);
    updateConfig({ symbol: stock.symbol, price: stock.price });
  };

  // 删除股票
  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    removeStock(id);
  };

  // 开始编辑
  const handleStartEdit = (e: React.MouseEvent, stock: typeof stocks[0]) => {
    e.stopPropagation();
    setEditingId(stock.id);
    setEditSymbol(stock.symbol);
  };

  // 确认编辑
  const handleConfirmEdit = async (id: string) => {
    if (!editSymbol.trim()) {
      setEditingId(null);
      return;
    }
    try {
      const stats = await getSymbolStats(editSymbol.trim());
      updateStock(id, { symbol: editSymbol.trim().toUpperCase(), price: stats.lastPrice });
    } catch {
      updateStock(id, { symbol: editSymbol.trim().toUpperCase() });
    }
    setEditingId(null);
  };

  return (
    <>
      <Card className="rounded-3xl border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <CardHeader className="flex flex-row items-center justify-between pb-4 pt-6 px-6">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Star className="w-5 h-5" /> 股票观察列表
          </CardTitle>
          <Button
            size="sm"
            className="bg-[#2563EB] hover:bg-blue-700 h-8 rounded-lg px-3 shadow-none"
            onClick={() => { setShowAddDialog(true); setNewSymbol(""); setAddError(""); }}
          >
            <Plus className="w-4 h-4 mr-1" /> 添加股票
          </Button>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="bg-[#EFF6FF] text-blue-600 text-xs rounded-lg p-2.5 text-center mb-4 flex items-center justify-center gap-1.5 font-medium border border-blue-100">
            <GripVertical className="w-3.5 h-3.5 text-blue-400" /> 拖动股票可以调整排序
          </div>
          <div className="space-y-3">
            {stocks.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelect(item)}
                className={`flex items-center justify-between p-3.5 rounded-2xl border bg-white transition-all group cursor-pointer shadow-sm ${
                  activeStockId === item.id
                    ? 'border-[#3b82f6] ring-2 ring-blue-100'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <GripVertical className="w-4 h-4 text-slate-300 cursor-grab" />
                  <div className={`w-2 h-2 rounded-full ${activeStockId === item.id ? 'bg-blue-500' : 'bg-slate-300'}`} />
                  {editingId === item.id ? (
                    <div className="flex items-center gap-1.5">
                      <Input
                        className="h-7 w-20 text-sm font-bold uppercase rounded-lg px-2 shadow-none"
                        value={editSymbol}
                        onChange={e => setEditSymbol(e.target.value)}
                        onClick={e => e.stopPropagation()}
                        onKeyDown={e => { if (e.key === 'Enter') handleConfirmEdit(item.id); }}
                        autoFocus
                      />
                      <button
                        className="h-6 w-6 flex items-center justify-center rounded text-green-600 bg-green-50 hover:bg-green-100"
                        onClick={(e) => { e.stopPropagation(); handleConfirmEdit(item.id); }}
                      >
                        <Check className="w-3 h-3" />
                      </button>
                      <button
                        className="h-6 w-6 flex items-center justify-center rounded text-slate-400 bg-slate-50 hover:bg-slate-100"
                        onClick={(e) => { e.stopPropagation(); setEditingId(null); }}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <span className="font-bold text-slate-800 text-sm tracking-tight">{item.symbol}</span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-sm text-slate-900">${item.price.toFixed(2)}</span>
                  {editingId !== item.id && (
                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="h-6 w-6 flex items-center justify-center rounded text-blue-500 bg-blue-50 hover:bg-blue-100 transition-colors"
                        onClick={(e) => handleStartEdit(e, item)}
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        className="h-6 w-6 flex items-center justify-center rounded text-red-500 border border-red-100 bg-red-50 hover:bg-red-100 transition-colors"
                        onClick={(e) => handleDelete(e, item.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {stocks.length === 0 && (
              <div className="text-center py-8 text-sm text-slate-400">
                暂无观察股票，点击上方添加
              </div>
            )}
          </div>
          <div className="text-center text-xs text-slate-400 mt-5 bg-slate-50 rounded-xl py-3 border border-slate-100 font-medium">
            共 {stocks.length} 只股票，点击股票查看图表
          </div>
        </CardContent>
      </Card>

      {/* 添加股票弹窗 */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[360px] rounded-3xl p-6 border-0 shadow-2xl">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-lg font-bold text-slate-800">添加观察股票</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-600 mb-2 block">股票代码 (美股)</label>
              <Input
                className="rounded-xl bg-slate-50 border-slate-200 h-12 px-4 shadow-none focus-visible:ring-[#3b82f6]/20 font-bold uppercase text-lg"
                value={newSymbol}
                onChange={e => setNewSymbol(e.target.value)}
                placeholder="例如: AAPL, TSLA, QQQ"
                onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
                autoFocus
              />
              <p className="text-xs text-slate-400 mt-2">系统将自动获取最新价格 (Stooq)</p>
            </div>
            {addError && (
              <div className="bg-red-50 text-red-500 text-xs p-3 rounded-lg border border-red-100 font-medium">
                {addError}
              </div>
            )}
          </div>
          <div className="flex justify-end mt-4 gap-2">
            <Button variant="outline" onClick={() => setShowAddDialog(false)} className="rounded-xl shadow-none h-10">
              取消
            </Button>
            <Button
              onClick={handleAdd}
              disabled={isAdding || !newSymbol.trim()}
              className="bg-[#3b82f6] hover:bg-blue-600 h-10 px-6 rounded-xl font-bold shadow-none"
            >
              {isAdding ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-1" />}
              添加
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
