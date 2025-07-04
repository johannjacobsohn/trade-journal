import { test } from 'node:test'
import * as assert from 'node:assert'
import { build } from '../helper'


  test('POST /orders creates a new order', async (t) => {
    const app = await build(t)

    const orderPayload = {
      symbol: 'AAPL',
      quantity: 10,
      price: 150,
      side: 'buy'
    }

    const res = await app.inject({
      method: 'POST',
      url: '/orders',
      payload: orderPayload
    })

    assert.strictEqual(res.statusCode, 201)
    const body = JSON.parse(res.body)
    assert.strictEqual(body.symbol, orderPayload.symbol)
    assert.strictEqual(body.quantity, orderPayload.quantity)
    assert.strictEqual(body.price, orderPayload.price)
    assert.strictEqual(body.side, orderPayload.side)
    assert.ok(body.id)
  })

  test('GET /orders returns list of orders', async (t) => {
    const app = await build(t)

    const res = await app.inject({
      method: 'GET',
      url: '/orders'
    })

    assert.strictEqual(res.statusCode, 200)
    const body = JSON.parse(res.body)
    assert.ok(Array.isArray(body))
  })

  test('GET /orders/:id returns a specific order', async (t) => {
    const app = await build(t)

    // First, create an order
    const orderPayload = {
      symbol: 'GOOG',
      quantity: 5,
      price: 2800,
      side: 'sell'
    }
    const createRes = await app.inject({
      method: 'POST',
      url: '/orders',
      payload: orderPayload
    })
    const createdOrder = JSON.parse(createRes.body)

    // Now, fetch the order by id
    const res = await app.inject({
      method: 'GET',
      url: `/orders/${createdOrder.id}`
    })

    assert.strictEqual(res.statusCode, 200)
    const body = JSON.parse(res.body)
    assert.strictEqual(body.id, createdOrder.id)
    assert.strictEqual(body.symbol, orderPayload.symbol)
  })

  test('POST /orders with invalid payload returns 400', async (t) => {
    const app = await build(t)

    const invalidPayload = {
      symbol: 'AAPL'
      // missing quantity, price, side
    }

    const res = await app.inject({
      method: 'POST',
      url: '/orders',
      payload: invalidPayload
    })

    assert.strictEqual(res.statusCode, 400)
  })
   
