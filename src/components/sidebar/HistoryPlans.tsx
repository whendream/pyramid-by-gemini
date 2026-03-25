import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { History, Trash2, Clock } from "lucide-react";
import { useHistoryStore } from "../../store/useHistoryStore";
import { usePlanStore } from "../../store/usePlanStore";

export default function HistoryPlans() {
  const { plans, clearAll, removePlan } = useHistoryStore();
  const { updateConfig } = usePlanStore();

  const handleLoad = (plan: typeof plans[0]) => {
    updateConfig({ ...plan.config });
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return `${d.getMonth() + 1}月${d.getDate()}日 ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <Card className="rounded-3xl border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
      <CardHeader className="flex flex-row items-center justify-between pb-4 pt-6 px-6">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <History className="w-5 h-5" /> 历史计划
        </CardTitle>
        {plans.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-lg px-3 text-red-500 border-red-200 bg-red-50 hover:bg-red-100 hover:text-red-600 shadow-none"
            onClick={clearAll}
          >
            <Trash2 className="w-4 h-4 mr-1" /> 清空
          </Button>
        )}
      </CardHeader>
      <CardContent className="px-6 pb-6">
        {plans.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-400">
            暂无历史计划，保存配置后自动记录
          </div>
        ) : (
          <div className="space-y-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => handleLoad(plan)}
                className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition-all cursor-pointer shadow-sm relative overflow-hidden group"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg tracking-tight text-slate-900">{plan.config.symbol}</h3>
                  <button
                    className="h-6 w-6 flex items-center justify-center rounded text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all"
                    onClick={(e) => { e.stopPropagation(); removePlan(plan.id); }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-y-2.5 text-sm">
                  <span className="text-slate-500">预算: <span className="text-slate-800 font-semibold">${plan.config.budget.toLocaleString()}</span></span>
                  <span className="text-slate-500">价格: <span className="text-slate-800 font-semibold">${plan.config.price.toFixed(2)}</span></span>
                  <span className="text-slate-500">加仓: <span className="text-slate-800 font-semibold">{plan.planRows.length}次</span></span>
                  <span className="text-slate-500">下跌: <span className="text-slate-800 font-semibold">{parseFloat((plan.config.dropRate * 100).toFixed(4))}%</span></span>
                  <span className="col-span-2 text-slate-500">平均成本: <span className="text-[#22c55e] font-bold text-[15px]">${plan.avgCost.toFixed(2)}</span></span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 mt-4">
                  <Clock className="w-3.5 h-3.5" /> {formatDate(plan.savedAt)}
                </div>
              </div>
            ))}
          </div>
        )}
        {plans.length > 0 && (
          <div className="text-center text-xs text-slate-400 mt-5 bg-slate-50 rounded-xl py-3 border border-slate-100 font-medium">
            共 {plans.length} 个保存的计划
          </div>
        )}
      </CardContent>
    </Card>
  );
}
