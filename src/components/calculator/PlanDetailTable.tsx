import { usePlanStore } from "../../store/usePlanStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Settings, CheckCircle2, Clock, Circle } from "lucide-react";

interface PlanDetailTableProps {
  onEditConfig: () => void;
}

export default function PlanDetailTable({ onEditConfig }: PlanDetailTableProps) {
  const { getPlanData, config, getExecutionStatus, toggleExecution } = usePlanStore();
  const { planRows, totalCost } = getPlanData();

  const statusUI = {
    executed: {
      icon: <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />,
      dot: 'bg-[#22c55e] ring-green-50',
      label: '已买入',
      labelClass: 'bg-green-50 text-[#22c55e] border-green-100',
    },
    triggered: {
      icon: <Clock className="w-4 h-4 text-[#3b82f6]" />,
      dot: 'bg-[#3b82f6] ring-blue-50',
      label: '待执行',
      labelClass: 'bg-blue-50 text-[#3b82f6] border-blue-100',
    },
    pending: {
      icon: <Circle className="w-4 h-4 text-slate-300" />,
      dot: 'bg-slate-300 ring-slate-50',
      label: '未触发',
      labelClass: 'bg-slate-50 text-slate-400 border-slate-100',
    },
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-8">
      <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">加仓计划详情</h3>
          <p className="text-sm text-slate-400 mt-1.5 font-medium">{config.symbol} - {planRows.length}次加仓序列</p>
        </div>
        <Button onClick={onEditConfig} className="bg-[#3b82f6] hover:bg-blue-600 shadow-none font-bold h-10 px-5 rounded-xl transition-all">
          <Settings className="w-4 h-4 mr-2 opacity-90" />
          编辑配置
        </Button>
      </div>
      <Table>
        <TableHeader className="bg-slate-50/80 border-b border-slate-100">
          <TableRow className="hover:bg-transparent border-0">
             <TableHead className="font-bold text-slate-500 h-14 px-8">加仓次数</TableHead>
             <TableHead className="font-bold text-slate-500 h-14">价格 (USD)</TableHead>
             <TableHead className="font-bold text-slate-500 h-14">下跌幅度</TableHead>
             <TableHead className="font-bold text-slate-500 h-14 text-center">比例系数</TableHead>
             <TableHead className="font-bold text-slate-500 h-14 text-right">买入数量</TableHead>
             <TableHead className="font-bold text-slate-500 h-14 text-right">买入金额</TableHead>
             <TableHead className="font-bold text-slate-500 h-14 text-right">累计持股</TableHead>
             <TableHead className="font-bold text-slate-500 h-14 text-right px-8">平均成本</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {planRows.map((row) => {
            const status = getExecutionStatus(row.level);
            const ui = statusUI[status];
            return (
              <TableRow key={row.level} className="hover:bg-slate-50/60 transition-colors border-b border-slate-50">
                <TableCell className="font-medium text-slate-700 py-5 px-8">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleExecution(row.level)}
                      className="hover:scale-110 transition-transform cursor-pointer"
                      title={status === 'executed' ? '点击取消标记' : '点击标记为已买入'}
                    >
                      {ui.icon}
                    </button>
                    第 {row.level} 次
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${ui.labelClass}`}>
                      {ui.label}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="font-bold text-slate-800 py-5 text-[15px]">${row.price.toFixed(2)}</TableCell>
                <TableCell className={`py-5 font-bold text-[13px] ${row.dropRate === 0 ? 'text-slate-400' : 'text-[#ef4444]'}`}>
                  {row.dropRate === 0 ? '-' : `▼ ${(row.dropRate * 100).toFixed(1)}%`}
                </TableCell>
                <TableCell className="text-center py-5">
                  <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-lg text-xs font-bold">{row.ratio}</span>
                </TableCell>
                <TableCell className="text-right font-medium text-slate-700 py-5">{row.shares} 股</TableCell>
                <TableCell className="text-right font-medium text-slate-700 py-5">${row.cost.toFixed(2)}</TableCell>
                <TableCell className="text-right font-bold text-slate-900 py-5">{row.accShares} 股</TableCell>
                <TableCell className="text-right font-bold text-slate-900 py-5 px-8">${row.accAvgCost.toFixed(2)}</TableCell>
              </TableRow>
            );
          })}
          <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-t-2 border-slate-100">
            <TableCell colSpan={4} className="text-right font-bold text-slate-500 py-6 text-sm">投入汇总：</TableCell>
            <TableCell className="text-right font-bold text-slate-900 text-base">{planRows[planRows.length - 1]?.accShares} 股</TableCell>
            <TableCell className="text-right font-bold text-slate-900 text-base">${totalCost.toFixed(2)}</TableCell>
            <TableCell colSpan={2} className="text-right font-bold text-slate-900 text-base bg-[#22c55e]/10 text-[#16a34a] px-8">
              预计平均成本: ${planRows[planRows.length - 1]?.accAvgCost.toFixed(2)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
