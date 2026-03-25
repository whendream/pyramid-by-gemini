import { useState } from "react";
import Header from "./Header";
import SummaryCards from "./SummaryCards";
import TargetNodes from "./TargetNodes";
import PlanDetailTable from "./PlanDetailTable";
import ConfigModal from "./ConfigModal";
import PriceChartReal from "./PriceChartReal";

export default function Calculator() {
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  return (
    <div className="flex flex-col h-full bg-white relative">
      <Header />
      <div className="p-8 pb-12 flex-1 relative overflow-y-auto custom-scrollbar">
        <PriceChartReal />
        <TargetNodes />
        <SummaryCards />
        <PlanDetailTable onEditConfig={() => setIsConfigOpen(true)} />
      </div>
      <ConfigModal open={isConfigOpen} onOpenChange={setIsConfigOpen} />
    </div>
  );
}
