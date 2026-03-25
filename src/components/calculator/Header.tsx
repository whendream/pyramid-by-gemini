import { Moon } from "lucide-react";

export default function Header() {
  return (
    <header className="px-8 py-6 flex items-center justify-between border-b border-slate-100 bg-white">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">股票左侧建仓计算器</h1>
        <p className="text-sm text-slate-500 mt-1.5 font-medium">倒金字塔建仓策略 · 越跌越买，科学管理仓位</p>
      </div>
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-5 text-[13px] font-bold text-slate-600">
          <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#22c55e] shadow-sm"></div>左侧交易</span>
          <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#3b82f6] shadow-sm"></div>风险分散</span>
          <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#a855f7] shadow-sm"></div>成本均摊</span>
        </div>
        <div className="w-px h-6 bg-slate-200"></div>
        <button className="text-slate-400 hover:text-slate-900 transition-colors w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100">
          <Moon className="w-4.5 h-4.5" />
        </button>
      </div>
    </header>
  );
}
