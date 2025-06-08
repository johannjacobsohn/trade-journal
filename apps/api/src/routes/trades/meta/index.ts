import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { PrismaClient } from '../../../generated/prisma/client';

const tradeMetaSchema = {
  type: 'object',
  properties: {
    symbol: { type: 'string' },
    notes: { type: 'string', nullable: true }
  },
  required: ['symbol']
};

const prisma = new PrismaClient();

export default async function (fastify: FastifyInstance, opts: FastifyPluginOptions) {
  fastify.addSchema({ $id: 'tradeMeta', ...tradeMetaSchema });

  fastify.get<{ Params: { symbol: string } }>('/:symbol', {
    schema: { response: { 200: tradeMetaSchema, 404: { type: 'object', properties: { error: { type: 'string' } }, required: ['error'] } } }
  }, async (request, reply) => {
    const meta = await prisma.tradeMeta.findUnique({ where: { symbol: request.params.symbol } });
    if (!meta) {
      reply.code(404);
      return { error: 'Meta not found' };
    }
    return meta;
  });

  fastify.put<{ Params: { symbol: string }, Body: { notes?: string } }>('/:symbol', {
    schema: {
      body: { type: 'object', properties: { notes: { type: 'string', nullable: true } } },
      response: { 200: tradeMetaSchema }
    }
  }, async (request, _reply) => {
    const { notes } = request.body;
    const meta = await prisma.tradeMeta.upsert({
      where: { symbol: request.params.symbol },
      update: { notes },
      create: { symbol: request.params.symbol, notes }
    });
    return meta;
  });
};
