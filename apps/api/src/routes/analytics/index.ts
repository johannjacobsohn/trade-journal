import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { PrismaClient } from '../../generated/prisma/client';

const analyticsSchema = {
  type: 'object',
  properties: {
    completedTrades: { type: 'number' },
    winRate: { type: 'number' },
    profitFactor: { type: 'number' },
    avgWin: { type: 'number' },
    avgLoss: { type: 'number' },
    avgHoldDurationDays: { type: 'number' }
  },
  required: ['completedTrades', 'winRate', 'profitFactor', 'avgWin', 'avgLoss', 'avgHoldDurationDays']
};

const prisma = new PrismaClient();

export default async function (fastify: FastifyInstance, opts: FastifyPluginOptions) {
  fastify.addSchema({ $id: 'analytics', ...analyticsSchema });

  fastify.get('/', {
    schema: { response: { 200: analyticsSchema } }
  }, async (_request, _reply) => {
    // Hole alle Orders
    const orders = await prisma.order.findMany();
    // Gruppiere nach Symbol
    const grouped = orders.reduce((acc, order) => {
      if (!acc[order.symbol]) acc[order.symbol] = [];
      acc[order.symbol].push(order);
      return acc;
    }, {} as Record<string, typeof orders>);

    // Ein Trade ist abgeschlossen, wenn buy und sell für ein Symbol existieren
    let completedTrades = 0;
    let wins = 0, losses = 0, winSum = 0, lossSum = 0, holdDurations: number[] = [];
    let grossProfit = 0, grossLoss = 0;
    for (const orders of Object.values(grouped)) {
      const buys = orders.filter(o => o.side === 'buy');
      const sells = orders.filter(o => o.side === 'sell');
      if (buys.length && sells.length) {
        completedTrades++;
        // G/V = Summe Sell - Summe Buy
        const buySum = buys.reduce((sum, o) => sum + o.price * o.quantity, 0);
        const sellSum = sells.reduce((sum, o) => sum + o.price * o.quantity, 0);
        const pnl = sellSum - buySum;
        if (pnl > 0) {
          wins++;
          winSum += pnl;
          grossProfit += pnl;
        } else if (pnl < 0) {
          losses++;
          lossSum += Math.abs(pnl);
          grossLoss += Math.abs(pnl);
        }
        // Haltedauer: min(buy.date) bis max(sell.date)
        const buyDates = buys.map(b => new Date(b.date));
        const sellDates = sells.map(s => new Date(s.date));
        if (buyDates.length && sellDates.length) {
          const minBuy = Math.min(...buyDates.map(d => d.getTime()));
          const maxSell = Math.max(...sellDates.map(d => d.getTime()));
          const days = (maxSell - minBuy) / (1000 * 60 * 60 * 24);
          if (days >= 0) holdDurations.push(days);
        }
      }
    }
    const winRate = completedTrades ? wins / completedTrades : 0;
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : 0;
    const avgWin = wins ? winSum / wins : 0;
    const avgLoss = losses ? -lossSum / losses : 0;
    const avgHoldDurationDays = holdDurations.length ? holdDurations.reduce((a, b) => a + b, 0) / holdDurations.length : 0;
    return {
      completedTrades,
      winRate,
      profitFactor,
      avgWin,
      avgLoss,
      avgHoldDurationDays
    };
  });
}
