# 📊 股票左侧建仓计算器 (Pyramid Position Builder)

一款基于**倒金字塔加仓策略**的专业量化建仓规划工具，帮助投资者在左侧交易中科学分配资金、精准控制风险。

> 🌐 在线体验：部署于 Vercel

## ✨ 核心特性

### 🧮 智能计算引擎
- **倒金字塔资金分配**：按权重比例（如 1:1.5:2）自动分配每次加仓预算
- **向下取整实盘逻辑**：买入股数严格取整，贴近真实交易场景
- **累计持股与平均成本**：实时计算每次加仓后的综合均价

### 📡 Stooq 历史行情接入
- 自动拉取美股近一年日线数据（EOD）
- 本地缓存机制（12 小时 TTL），避免频繁请求
- 生产环境通过 Vercel Rewrites 代理，无需第三方 CORS 服务

### 🤖 智能测算推荐
- **ATR(14) 真实波动率**：量化每日价格波动幅度
- **最大回撤 (Max Drawdown)**：评估历史极端风险
- **智能跌幅推荐**：`推荐跌幅 = Max(最大回撤 ÷ 加仓次数, 2×ATR%)`
- **智能入场价推荐**：`建议入场价 = 近20日高点 - 1×ATR`

### 📋 加仓执行追踪
- 三级状态：✅ 已买入 → 🔵 待执行 → ⚪ 未触发
- 手动标记 + 价格自动判定的混合模式
- 按股票代码独立存储执行状态

### 📈 可视化面板
- Recharts 驱动的价格走势图（模拟 180 交易日）
- 加仓点位参考线标注
- 加仓状态卡片实时联动

### 🗂️ 数据管理
- **股票观察列表**：添加、编辑、删除、选中联动计算器
- **历史计划存档**：保存配置后自动归档，支持一键回显和清空
- **全部本地持久化**（Zustand + localStorage），刷新不丢失

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Vite + React 18 + TypeScript |
| 样式 | Tailwind CSS + tailwindcss-animate |
| 组件 | shadcn/ui (Card, Table, Dialog, Button...) |
| 状态 | Zustand + persist 中间件 |
| 图表 | Recharts |
| 图标 | Lucide React |
| 数据 | Stooq 历史行情 (EOD) |
| 部署 | Vercel (Rewrites 代理) |

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 本地开发
npm run dev

# 构建生产包
npm run build
```

## 📁 项目结构

```
src/
├── components/
│   ├── calculator/    # 计算器主面板 (图表、卡片、表格、配置弹窗)
│   ├── sidebar/       # 左侧栏 (观察列表、历史计划)
│   ├── layout/        # 布局容器
│   └── ui/            # shadcn/ui 基础组件
├── store/             # Zustand 状态管理
│   ├── usePlanStore   # 计算配置 + 执行追踪
│   ├── useWatchListStore  # 股票观察列表
│   └── useHistoryStore    # 历史计划存档
├── lib/               # 核心逻辑
│   ├── mathLogic      # 倒金字塔计算引擎
│   ├── indicators     # ATR / 最大回撤算法
│   └── api            # Stooq 数据服务 + 缓存
└── App.tsx
```

## ⚠️ 免责声明

本工具仅供学习和参考，不构成任何投资建议。基于历史数据的计算不代表未来收益，投资决策请自行负责。
