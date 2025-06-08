import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { PrismaClient } from '../../../generated/prisma/client';
import { addDays, formatISO } from 'date-fns';

const prisma = new PrismaClient();

function randomSymbol() {
  const symbols = ['AAPL', 'TSLA', 'GOOG', 'MSFT', 'AMZN', 'NVDA', 'META', 'SAP', 'BAS', 'VOW3'];
  return symbols[Math.floor(Math.random() * symbols.length)];
}
function randomSide() {
  return Math.random() > 0.5 ? 'buy' : 'sell';
}
function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export default async function (fastify: FastifyInstance, opts: FastifyPluginOptions) {
  // POST /orders/import-dummy
  fastify.post('/', {
    schema: {
      response: { 200: { type: 'object', properties: { count: { type: 'number' } }, required: ['count'] } }
    }
  }, async (_request, _reply) => {
    const orders = [];
    const today = new Date();
    for (let i = 0; i < 500; i++) {
      const symbol = randomSymbol();
      const side = randomSide();
      const quantity = Math.floor(Math.random() * 50) + 1;
      const price = Number((Math.random() * 500 + 10).toFixed(2));
      const date = randomDate(addDays(today, -365), today);
      const comments = Math.random() > 0.7 ? `Dummy comment ${i}` : '';
      orders.push({ symbol, quantity, price, side, date: formatISO(date), comments });
    }
    await prisma.order.createMany({ data: orders });
    return { count: orders.length };
  });
}
