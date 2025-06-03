import { FastifyInstance, FastifyPluginOptions } from 'fastify'

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

let orders: Order[] = [
  { id: 1, symbol: 'AAPL', quantity: 10, price: 150, side: 'buy' },
  { id: 2, symbol: 'GOOGL', quantity: 5, price: 2800, side: 'sell' }
]
let nextId = 1

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
      return orders
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
      const order = orders.find(o => o.id === id)
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
      const order: Order = {
        id: nextId++,
        symbol,
        quantity,
        price,
        side
      }
      orders.push(order)
      reply.code(201)
      return order
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
      const idx = orders.findIndex(o => o.id === id)
      if (idx === -1) {
        reply.code(404)
        return { error: 'Order not found' }
      }
      const { symbol, quantity, price, side } = request.body as Omit<Order, 'id'>
      orders[idx] = { id, symbol, quantity, price, side }
      return orders[idx]
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
      const idx = orders.findIndex(o => o.id === id)
      if (idx === -1) {
        reply.code(404)
        return { error: 'Order not found' }
      }
      orders.splice(idx, 1)
      reply.code(204)
      return
    }
  })
}