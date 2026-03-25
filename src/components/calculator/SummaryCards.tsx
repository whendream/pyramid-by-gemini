import { usePlanStore } from "../../store/usePlanStore";
import { DollarSign, Wallet2, TrendingDown, Layers } from "lucide-react";

export default function SummaryCards() {
  const { getPlanData, config } = usePlanStore();
  const { totalCost, remainBudget, planRows } = getPlanData();
  const accAvgCost = planRows[planRows.length - 1]?.accAvgCost || 0;
  
  const nextPlan = planRows.find((r) => r.level === 2) || planRows[0];

  return (
    <div className="grid grid-cols-4 gap-4 mb-8">
      <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm text-center flex flex-col items-center justify-center group hover:border-[#22c55e]/30 hover:shadow-md transition-all">
        <div className="flex justify-center items-center gap-1.5 mb-3 text-[#22c55e] font-bold text-sm bg-green-50 px-3 py-1 rounded-full"><DollarSign className="w-4 h-4" /> 总投预期</div>
        <div className="text-2xl font-bold text-slate-900 tracking-tight">${totalCost.toFixed(2)}</div>
        <div className="text-xs text-slate-400 mt-2 font-medium">占总预算 {((totalCost / config.budget) * 100).toFixed(1)}%</div>
      </div>

      <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm text-center flex flex-col items-center justify-center group hover:border-[#3b82f6]/30 hover:shadow-md transition-all">
        <div className="flex justify-center items-center gap-1.5 mb-3 text-[#3b82f6] font-bold text-sm bg-blue-50 px-3 py-1 rounded-full"><Wallet2 className="w-4 h-4" /> 剩余储备</div>
        <div className="text-2xl font-bold text-slate-900 tracking-tight">${remainBudget.toFixed(2)}</div>
        <div className="text-xs text-slate-400 mt-2 font-medium">可用应急资金</div>
      </div>

      <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm text-center flex flex-col items-center justify-center group hover:border-[#ef4444]/30 hover:shadow-md transition-all">
        <div className="flex justify-center items-center gap-1.5 mb-3 text-[#ef4444] font-bold text-sm bg-red-50 px-3 py-1 rounded-full"><TrendingDown className="w-4 h-4" /> 下次加仓</div>
        <div className="text-2xl font-bold text-slate-900 tracking-tight">${nextPlan?.price.toFixed(2)}</div>
        <div className="text-xs text-slate-400 mt-2 font-medium">下跌 {(nextPlan?.dropRate * 100).toFixed(1)}%触发</div>
      </div>

      <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm text-center flex flex-col items-center justify-center group hover:border-[#a855f7]/30 hover:shadow-md transition-all">
        <div className="flex justify-center items-center gap-1.5 mb-3 text-[#a855f7] font-bold text-sm bg-purple-50 px-3 py-1 rounded-full"><Layers className="w-4 h-4" /> 平均成本</div>
        <div className="text-2xl font-bold text-slate-900 tracking-tight">${accAvgCost.toFixed(2)}</div>
        <div className="text-xs text-slate-400 mt-2 font-medium">全部计划执行后</div>
      </div>
    </div>
  );
}
