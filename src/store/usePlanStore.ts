import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { calculateGrid, type PlanRow } from '../lib/mathLogic'

export interface PlanConfig {
  symbol: string;
  budget: number;
  price: number;
  dropRate: number;
  ratios: number[];
}

// 每个 symbol 的执行状态记录
export interface ExecutionRecord {
  [level: number]: {
    executed: boolean;
    executedAt?: number; // 时间戳
  };
}

interface PlanState {
  config: PlanConfig;
  // symbol -> { level -> { executed, executedAt } }
  executions: Record<string, ExecutionRecord>;
  updateConfig: (newConfig: Partial<PlanConfig>) => void;
  toggleExecution: (level: number) => void;
  resetExecutions: () => void;
  getExecutionStatus: (level: number) => 'executed' | 'triggered' | 'pending';
  getPlanData: () => {
    planRows: PlanRow[];
    totalCost: number;
    remainBudget: number;
  };
}

export const usePlanStore = create<PlanState>()(
  persist(
    (set, get) => ({
      config: {
        symbol: "QQQ",
        budget: 6000,
        price: 601.30,
        dropRate: 0.07,
        ratios: [1, 1.5, 2],
      },
      executions: {},

      updateConfig: (newConfig) =>
        set((state) => ({
          config: { ...state.config, ...newConfig },
        })),

      toggleExecution: (level: number) =>
        set((state) => {
          const sym = state.config.symbol;
          const current = state.executions[sym] ?? {};
          const isCurrentlyExecuted = current[level]?.executed ?? false;
          return {
            executions: {
              ...state.executions,
              [sym]: {
                ...current,
                [level]: {
                  executed: !isCurrentlyExecuted,
                  executedAt: !isCurrentlyExecuted ? Date.now() : undefined,
                },
              },
            },
          };
        }),

      resetExecutions: () =>
        set((state) => {
          const sym = state.config.symbol;
          return {
            executions: {
              ...state.executions,
              [sym]: {},
            },
          };
        }),

      // 综合判断：已手动标记 > 价格已触发 > 待触发
      getExecutionStatus: (level: number) => {
        const state = get();
        const sym = state.config.symbol;
        const record = state.executions[sym]?.[level];
        if (record?.executed) return 'executed';

        // 根据当前价格判断是否"已触发"
        const { planRows } = calculateGrid(
          state.config.budget,
          state.config.price,
          state.config.dropRate,
          state.config.ratios,
        );
        const row = planRows.find(r => r.level === level);
        if (row && state.config.price <= row.price) return 'triggered';

        return 'pending';
      },

      getPlanData: () => {
        const { budget, price, dropRate, ratios } = get().config;
        return calculateGrid(budget, price, dropRate, ratios);
      },
    }),
    {
      name: 'plan-storage',
    }
  )
)
