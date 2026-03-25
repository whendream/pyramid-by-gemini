import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface StockItem {
  id: string;
  symbol: string;
  price: number;       // 最新价格（来自 Stooq 或手动输入）
  addedAt: number;     // 添加时间戳
}

interface WatchListState {
  stocks: StockItem[];
  activeStockId: string | null;
  addStock: (symbol: string, price: number) => void;
  removeStock: (id: string) => void;
  updateStock: (id: string, updates: Partial<Pick<StockItem, 'symbol' | 'price'>>) => void;
  setActiveStock: (id: string) => void;
  getActiveStock: () => StockItem | undefined;
}

export const useWatchListStore = create<WatchListState>()(
  persist(
    (set, get) => ({
      stocks: [
        { id: 'default-qqq', symbol: 'QQQ', price: 600.38, addedAt: Date.now() },
        { id: 'default-voo', symbol: 'VOO', price: 615.19, addedAt: Date.now() },
      ],
      activeStockId: 'default-qqq',

      addStock: (symbol, price) => {
        const id = `stock-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        set((state) => ({
          stocks: [...state.stocks, { id, symbol: symbol.toUpperCase(), price, addedAt: Date.now() }],
          activeStockId: id, // 自动选中新添加的
        }));
      },

      removeStock: (id) =>
        set((state) => {
          const filtered = state.stocks.filter(s => s.id !== id);
          return {
            stocks: filtered,
            activeStockId: state.activeStockId === id
              ? (filtered[0]?.id ?? null)
              : state.activeStockId,
          };
        }),

      updateStock: (id, updates) =>
        set((state) => ({
          stocks: state.stocks.map(s =>
            s.id === id ? { ...s, ...updates } : s
          ),
        })),

      setActiveStock: (id) => set({ activeStockId: id }),

      getActiveStock: () => {
        const { stocks, activeStockId } = get();
        return stocks.find(s => s.id === activeStockId);
      },
    }),
    { name: 'watchlist-storage' }
  )
)
