import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PlanConfig } from './usePlanStore'
import type { PlanRow } from '../lib/mathLogic'

export interface HistoryPlan {
  id: string;
  config: PlanConfig;
  planRows: PlanRow[];
  totalCost: number;
  remainBudget: number;
  avgCost: number;
  savedAt: number;
}

interface HistoryState {
  plans: HistoryPlan[];
  savePlan: (config: PlanConfig, planRows: PlanRow[], totalCost: number, remainBudget: number) => void;
  removePlan: (id: string) => void;
  clearAll: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      plans: [],

      savePlan: (config, planRows, totalCost, remainBudget) => {
        const avgCost = planRows[planRows.length - 1]?.accAvgCost ?? 0;
        const plan: HistoryPlan = {
          id: `plan-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          config: { ...config },
          planRows: [...planRows],
          totalCost,
          remainBudget,
          avgCost,
          savedAt: Date.now(),
        };
        set((state) => ({
          plans: [plan, ...state.plans],
        }));
      },

      removePlan: (id) =>
        set((state) => ({
          plans: state.plans.filter(p => p.id !== id),
        })),

      clearAll: () => set({ plans: [] }),
    }),
    { name: 'history-storage' }
  )
)
