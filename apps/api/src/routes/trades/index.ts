import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { PrismaClient } from '../../generated/prisma/client';

const tradeSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    symbol: { type: 'string' },
    totalQuantity: { type: 'number' },
    avgPrice: { type: 'number' },
    realizedPnL: { type: 'number' },
    orders: { type: 'array', items: { type: 'integer' } }
  },
  required: ['id', 'symbol', 'totalQuantity', 'avgPrice', 'realizedPnL', 'orders']
};

const prisma = new PrismaClient();

export default async function (fastify: FastifyInstance, opts: FastifyPluginOptions, ) {
  fastify.addSchema({ $id: 'trade', ...tradeSchema });

  fastify.get('/', {
    schema: { response: { 200: { type: 'array', items: tradeSchema } } }
  }, async (_request, _reply) => {

    const orders = await prisma.order.findMany();

    const grouped = orders.reduce((acc, order) => {
      if (!acc[order.symbol]) acc[order.symbol] = [];
      acc[order.symbol].push(order);
      return acc;
    }, {} as Record<string, typeof orders>);

    const trades = Object.entries(grouped).map(([symbol, orders], idx) => {
        const totalQuantity = orders.reduce((sum, o) => sum + o.quantity, 0);
        const avgPrice = orders.reduce((sum, o) => sum + o.price * o.quantity, 0) / totalQuantity;
        const sellSum = orders.filter(o => o.side === 'sell').reduce((sum, o) => sum + o.price * o.quantity, 0);
        const buySum = orders.filter(o => o.side === 'buy').reduce((sum, o) => sum + o.price * o.quantity, 0);
    
        return {
            id: idx + 1,
            symbol,
            totalQuantity,
            avgPrice: isNaN(avgPrice) ? 0 : avgPrice, // its 0/0 if all prices are 0
            realizedPnL: sellSum - buySum,
            orders: orders.map(o => o.id)
        };
    });

    return trades;
  });
};
