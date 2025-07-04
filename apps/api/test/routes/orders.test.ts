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

  test('GET /orders supports filtering by symbol', async (t) => {
    const app = await build(t)

    // Create two orders with different symbols
    await app.inject({
      method: 'POST',
      url: '/orders',
      payload: { symbol: 'AAPL', quantity: 1, price: 100, side: 'buy' }
    })
    await app.inject({
      method: 'POST',
      url: '/orders',
      payload: { symbol: 'TSLA', quantity: 2, price: 200, side: 'sell' }
    })

    // Filter by symbol=AAPL
    const res = await app.inject({
      method: 'GET',
      url: '/orders?symbol=AAPL'
    })

    assert.strictEqual(res.statusCode, 200)
    const body = JSON.parse(res.body)
    assert.ok(Array.isArray(body))
    assert.ok(body.length > 0)
    body.forEach((order: any) => {
      assert.strictEqual(order.symbol, 'AAPL')
    })
  })

  test('GET /orders supports sorting by price descending', async (t) => {
    const app = await build(t)

    // Create orders with different prices
    await app.inject({
      method: 'POST',
      url: '/orders',
      payload: { symbol: 'AAPL', quantity: 1, price: 100, side: 'buy' }
    })
    await app.inject({
      method: 'POST',
      url: '/orders',
      payload: { symbol: 'AAPL', quantity: 1, price: 300, side: 'buy' }
    })
    await app.inject({
      method: 'POST',
      url: '/orders',
      payload: { symbol: 'AAPL', quantity: 1, price: 200, side: 'buy' }
    })

    // Sort by price descending
    const res = await app.inject({
      method: 'GET',
      url: '/orders?sort=price:desc'
    })

    assert.strictEqual(res.statusCode, 200)
    const body = JSON.parse(res.body)
    assert.ok(Array.isArray(body))
    for (let i = 1; i < body.length; i++) {
      assert.ok(body[i - 1].price >= body[i].price)
    }
  })

  test('GET /orders supports sorting by quantity ascending', async (t) => {
    const app = await build(t)

    // Create orders with different quantities
    await app.inject({
      method: 'POST',
      url: '/orders',
      payload: { symbol: 'AAPL', quantity: 5, price: 100, side: 'buy' }
    })
    await app.inject({
      method: 'POST',
      url: '/orders',
      payload: { symbol: 'AAPL', quantity: 2, price: 100, side: 'buy' }
    })
    await app.inject({
      method: 'POST',
      url: '/orders',
      payload: { symbol: 'AAPL', quantity: 10, price: 100, side: 'buy' }
    })

    // Sort by quantity ascending
    const res = await app.inject({
      method: 'GET',
      url: '/orders?sort=quantity:asc'
    })

    assert.strictEqual(res.statusCode, 200)
    const body = JSON.parse(res.body)
    assert.ok(Array.isArray(body))
    for (let i = 1; i < body.length; i++) {
      assert.ok(body[i - 1].quantity <= body[i].quantity)
    }
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
   
