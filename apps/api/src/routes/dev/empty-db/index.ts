import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { PrismaClient } from '../../../generated/prisma/client';

const prisma = new PrismaClient();

export default async function (fastify: FastifyInstance, opts: FastifyPluginOptions) {
  fastify.post('/', {
    schema: {
      response: {
        200: { type: 'object', properties: { ok: { type: 'boolean' } }, required: ['ok'] },
        500: { type: 'object', properties: { error: { type: 'string' } }, required: ['error'] }
      }
    }
  }, async (_request, reply) => {
    try {
      await prisma.order.deleteMany();
      await prisma.tradeMeta.deleteMany();
      await prisma.depot.deleteMany();
      return { ok: true };
    } catch (e: any) {
      reply.code(500);
      return { error: e.message || 'Unknown error' };
    }
  });
}
