import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { PrismaClient } from '@prisma/client'


const orderSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    symbol: { type: 'string' },
    quantity: { type: 'number' },
    price: { type: 'number' },
    side: { type: 'string', enum: ['buy', 'sell'] }
  },
  required: ['id', 'symbol', 'quantity', 'price', 'side']
}

const orderInputSchema = {
  type: 'object',
  properties: {
    symbol: { type: 'string' },
    quantity: { type: 'number' },
    price: { type: 'number' },
    side: { type: 'string', enum: ['buy', 'sell'] }
  },
  required: ['symbol', 'quantity', 'price', 'side']
}

const orderIdParamSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' }
  },
  required: ['id']
}

interface Order {
  id: number
  symbol: string
  quantity: number
  price: number
  side: 'buy' | 'sell'
}

const prisma = new PrismaClient()

export default async function (fastify: FastifyInstance, opts: FastifyPluginOptions) {

  fastify.addSchema(
    {
      $id: 'order',
      ...orderSchema
    }
  )
  fastify.addSchema(
    {
      $id: 'orderInput',
      ...orderInputSchema
    }
  )
  fastify.addSchema(
    {
      $id: 'orderIdParam',
      ...orderIdParamSchema
    }
  )

  // Get all orders
  fastify.get('/', {
    schema: {
      response: {
        200: {
          type: 'array',
          items: { $ref: 'order#' }
        }
      }
    },
    async handler (request, reply) {
      return prisma.order.findMany()
    }
  })

  // Get order by id
  fastify.get<{ Params: { id: string } }>('/:id', {
    schema: {
      params: { $ref: 'orderIdParam#' },
      response: {
        200: { $ref: 'order#' },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          },
          required: ['error']
        }
      }
    },
    async handler(request, reply) {
      const id = Number(request.params.id)
      const order = await prisma.order.findUnique({
        where: { id }
      })
      if (!order) {
        reply.code(404)
        return { error: 'Order not found' }
      }
      return order
    }
  })

  // Add schema to create new order
  fastify.post('/', {
    schema: {
      body: { $ref: 'orderInput#' },
      response: {
        201: { $ref: 'order#' },
        400: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          },
          required: ['error']
        }
      }
    },
    async handler(request, reply) {
      const { symbol, quantity, price, side } = request.body as Omit<Order, 'id'>

      if (!symbol || !quantity || !price || !side) {
        reply.code(400)
        return { error: 'Missing fields' }
      }

      await prisma.order.create({
        data: {
          symbol: symbol,
          quantity: quantity,
          price: price,
          side: side
        }
      })

      reply.code(201)
    }
  })

  // Add schema to update order
  fastify.put<{ Params: { id: string } }>('/:id', {
    schema: {
      params: { $ref: 'orderIdParam#' },
      body: { $ref: 'orderInput#' },
      response: {
        200: { $ref: 'order#' },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          },
          required: ['error']
        }
      }
    },
    async handler(request, reply) {
      const id = Number(request.params.id)
      const { symbol, quantity, price, side } = request.body as Omit<Order, 'id'>

      return prisma.order.update({
        where: { id },
        data: {
          symbol, quantity, price, side
        }
      })
    }
  })

  // Add schema to delete order
  fastify.delete<{ Params: { id: string } }>('/:id', {
    schema: {
      params: { $ref: 'orderIdParam#' },
      response: {
        204: { type: 'null' },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          },
          required: ['error']
        }
      }
    },
    async handler(request, reply) {
      const id = Number(request.params.id)

      return prisma.order.delete({
        where: { id }
      })

    }
  })
}