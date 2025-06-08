import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { PrismaClient } from '../../generated/prisma/client';

const openStockSchema = {
  type: 'object',
  properties: {
    symbol: { type: 'string' },
    shares: { type: 'number' },
    invested: { type: 'number' }
  },
  required: ['symbol', 'shares', 'invested']
};

const prisma = new PrismaClient();

export default async function (fastify: FastifyInstance, opts: FastifyPluginOptions) {
  fastify.addSchema({ $id: 'openStock', ...openStockSchema });

  fastify.get('/', {
    schema: { response: { 200: { type: 'array', items: openStockSchema } } }
  }, async (_request, _reply) => {
    const orders = await prisma.order.findMany();
    const grouped = orders.reduce((acc, order) => {
      if (!acc[order.symbol]) acc[order.symbol] = [];
      acc[order.symbol].push(order);
      return acc;
    }, {} as Record<string, typeof orders>);

    const openStocks = Object.entries(grouped)
      .map(([symbol, orders]) => {
        let shares = 0;
        let invested = 0;
        for (const o of orders) {
          if (o.side === 'buy') {
            shares += o.quantity;
            invested += o.price * o.quantity;
          } else if (o.side === 'sell') {
            shares -= o.quantity;
            invested -= o.price * o.quantity;
          }
        }
        if (shares > 0) {
          return { symbol, shares, invested };
        }
        return null;
      })
      .filter(Boolean);
    return openStocks;
  });
};
