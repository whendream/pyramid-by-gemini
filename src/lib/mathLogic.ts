export interface PlanRow {
  level: number;
  price: number;
  dropRate: number;
  ratio: number;
  shares: number;
  cost: number;
  accShares: number;
  accAvgCost: number;
}

export function calculateGrid(budget: number, price: number, dropRate: number, ratios: number[]) {
  const totalRatio = ratios.reduce((a, b) => a + b, 0);
  let totalShares = 0;
  let totalCost = 0;

  const planRows: PlanRow[] = ratios.map((ratio, index) => {
    const levelPrice = price * (1 - dropRate * index);
    const levelBudget = budget * (ratio / totalRatio);
    const sharesToBuy = Math.floor(levelBudget / levelPrice); // 向下取整实盘逻辑
    const cost = sharesToBuy * levelPrice;

    totalShares += sharesToBuy;
    totalCost += cost;

    return {
      level: index + 1,
      price: levelPrice,
      dropRate: dropRate * index,
      ratio,
      shares: sharesToBuy,
      cost,
      accShares: totalShares,
      accAvgCost: totalShares > 0 ? totalCost / totalShares : 0,
    };
  });

  return { planRows, totalCost, remainBudget: budget - totalCost };
}
