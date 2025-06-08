import { test } from 'node:test';
import assert from 'node:assert/strict';
import Fastify from 'fastify';
import tradesRoute from '../../src/routes/trades/index';

test('GET /trades returns aggregated trades', async (t) => {
  const fastify = Fastify();
  const mockOrders = [
    { id: 1, symbol: 'AAPL', quantity: 2, price: 100, side: 'buy' },
    { id: 2, symbol: 'AAPL', quantity: 1, price: 120, side: 'sell' },
    { id: 3, symbol: 'TSLA', quantity: 3, price: 200, side: 'buy' },
    { id: 4, symbol: 'TSLA', quantity: 1, price: 250, side: 'sell' }
  ];

  const prisma = { order: { findMany: async () => mockOrders } } as any;

  await tradesRoute(fastify, { prisma });

  const response = await fastify.inject({ method: 'GET', url: '/' });
  assert.equal(response.statusCode, 200);
  const trades = response.json();
  assert.ok(Array.isArray(trades));
  assert.deepEqual(trades, [
    {
      id: 1,
      symbol: 'AAPL',
      totalQuantity: 3,
      avgPrice: (2*100+1*120)/3,
      realizedPnL: 120-200,
      orders: [1,2]
    },
    {
      id: 2,
      symbol: 'TSLA',
      totalQuantity: 4,
      avgPrice: (3*200+1*250)/4,
      realizedPnL: 250-600,
      orders: [3,4]
    }
  ]);
});
