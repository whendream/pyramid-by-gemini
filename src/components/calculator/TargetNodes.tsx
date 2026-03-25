import { usePlanStore } from "../../store/usePlanStore";

export default function TargetNodes() {
  const { getPlanData, getExecutionStatus } = usePlanStore();
  const { planRows } = getPlanData();

  const statusConfig = {
    executed: { label: '已买入', badge: 'bg-[#22c55e] text-white', border: 'border-[#22c55e]/40 bg-green-50/50', text: 'text-[#16a34a]' },
    triggered: { label: '待执行', badge: 'bg-[#3b82f6] text-white', border: 'border-[#3b82f6] bg-[#eff6ff] shadow-sm transform -translate-y-1', text: 'text-[#1e3a8a]' },
    pending: { label: '未触发', badge: 'bg-slate-200 text-slate-500', border: 'border-slate-100 bg-slate-50 hover:border-slate-300', text: 'text-slate-700' },
  };

  return (
    <div className="mb-8">
      <h3 className="font-bold text-slate-800 mb-4 text-[15px] pl-1">加仓点位执行情况</h3>
      <div className="grid grid-cols-3 gap-5">
        {planRows.map((row) => {
          const status = getExecutionStatus(row.level);
          const cfg = statusConfig[status];
          return (
            <div 
              key={row.level} 
              className={`rounded-3xl p-6 text-center border-2 transition-all duration-300 relative overflow-hidden ${cfg.border}`}
            >
              <div className={`text-sm font-bold mb-4 flex items-center justify-center gap-2 ${status === 'pending' ? 'text-slate-500' : 'text-slate-800'}`}>
                第 {row.level} 次加仓
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold shadow-sm tracking-wide ${cfg.badge}`}>
                  {cfg.label}
                </span>
              </div>
              <div className={`text-3xl font-black mb-3 tracking-tight ${cfg.text}`}>
                ${row.price.toFixed(2)}
              </div>
              <div className={`text-[13px] font-medium space-y-1.5 ${status === 'triggered' ? 'text-blue-600/80' : 'text-slate-400'}`}>
                <p>{row.dropRate === 0 ? '基准价' : `下跌 ${(row.dropRate * 100).toFixed(1)}%`}</p>
                <p>计划买入 {row.shares} 股</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
