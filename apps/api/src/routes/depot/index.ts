import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { PrismaClient } from '../../generated/prisma/client';

const depotSchema = {
  type: 'object',
  properties: {
    value: { type: 'number' }
  },
  required: ['value']
};

const prisma = new PrismaClient();

export default async function (fastify: FastifyInstance, opts: FastifyPluginOptions) {
  fastify.addSchema({ $id: 'depot', ...depotSchema });

  // GET /depot: aktuellen Depotwert abrufen
  fastify.get('/', {
    schema: { response: { 200: depotSchema } }
  }, async (_request, _reply) => {
    // Einfache Lösung: Wert aus einer Tabelle holen, sonst 0
    const depot = await prisma.depot.findFirst();
    return { value: depot?.value ?? 0 };
  });

  // POST /depot: Depotwert setzen
  fastify.post('/', {
    schema: {
      body: depotSchema,
      response: { 200: depotSchema }
    }
  }, async (request, _reply) => {
    const { value } = request.body as { value: number };
    // Upsert: Wenn vorhanden, aktualisieren, sonst anlegen
    const depot = await prisma.depot.upsert({
      where: { id: 1 },
      update: { value },
      create: { id: 1, value }
    });
    return { value: depot.value };
  });
}
