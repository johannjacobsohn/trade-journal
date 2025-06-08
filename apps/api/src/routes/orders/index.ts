import { FastifyInstance, FastifyPluginOptions } from 'fastify'
// import { PrismaClient } from '@prisma/client'
import { PrismaClient } from '../../generated/prisma/client'

const orderSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    symbol: { type: 'string' },
    quantity: { type: 'number' },
    price: { type: 'number' },
    side: { type: 'string', enum: ['buy', 'sell'] },
    date: { type: 'string', format: 'date-time' },
    comments: { type: 'string', nullable: true }
  },
  required: ['id', 'symbol', 'quantity', 'price', 'side', 'date']
}

const orderInputSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer', nullable: true }, // id is optional for creation
    symbol: { type: 'string' },
    quantity: { type: 'number' },
    price: { type: 'number' },
    side: { type: 'string', enum: ['buy', 'sell'] },
    date: { type: 'string', format: 'date-time' },
    comments: { type: 'string', nullable: true }
  },
  required: ['symbol', 'quantity', 'price', 'side', 'date'],
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
  date: string // ISO date string
  comments: string
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
  fastify.get<{
    Querystring: {
      symbol?: string
      side?: 'buy' | 'sell'
      price?: string
      quantity?: string
      sort?: string
    }
  }>('/', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          symbol: { type: 'string' },
          side: { type: 'string', enum: ['buy', 'sell'] },
          price: { type: 'string' },
          quantity: { type: 'string' },
          sort: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'array',
          items: { $ref: 'order#' }
        }
      }
    },
    async handler (request, reply) {

      const where = {
        symbol: request.query.symbol || undefined,
        side: request.query.side || undefined,
        price: request.query.price ? Number(request.query.price) : undefined,
        quantity: request.query.quantity ? Number(request.query.quantity) : undefined
      }
      const orderBy = request.query.sort || 'id'
      const [orderKey = "id", orderDirection = "asc"] = orderBy.split(':')

      const orders = await prisma.order.findMany({
        where,
        orderBy: {
          [orderKey]: orderDirection
        }
      })


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
      const { symbol, quantity, price, side, date, comments = "", ...rest } = request.body as Omit<Order, 'id'>
      const data = { symbol, quantity,  price, side, date, comments } 
      
      for (const key in data) {
        if (data[key as keyof typeof data] === undefined) {
          reply.code(400)
          return { error: `Missing field: ${key}` }
        }
      }
      for (const key in rest) {
        reply.code(400)
        return { error: `Unexpected field: ${key}` }
      }

      const order = await prisma.order.create({
        data
      })

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
      const { symbol, quantity, price, side, date, comments = "", ...rest } = request.body as Omit<Order, 'id'>
      const data = { symbol, quantity,  price, side, date, comments } 

      for (const key in data) {
        if (data[key as keyof typeof data] === undefined) {
          reply.code(400)
          return { error: `Missing field: ${key}` }
        }
      }
      for (const key in rest) {
        if (key === 'id') continue
        reply.code(400)
        return { error: `Unexpected field: ${key}` }
      }

      return prisma.order.update({
        where: { id },
        data: data
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