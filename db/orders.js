const { createCart } = require('./cart')
const { client } = require('./client')

const getOrdersByUserId = async (userId) => {
  try {
    const { rows: orderIds } = await client.query(`
    SELECT id FROM orders
    WHERE "userId" = $1 AND is_complete = true
    `, [userId])

    const orders = Promise.all(orderIds.map(async (order) => {
      return await getOrderById(order.id)
    }))

    return orders
  } catch (error) {
    console.error(error)
    throw error
  }
}

const getOrderById = async (orderId) => {
  try {
    const { rows: [order] } = await client.query(`
    SELECT * FROM orders
    WHERE id = $1 AND is_complete = true
    `, [orderId])

    const { rows: products } = await client.query(`
    SELECT * FROM order_products 
    WHERE "orderId" = $1
    `, [orderId])

    order.products = products
    return order

  } catch (error) {
    console.error(error)
    throw error
  }
}

const completeOrder = async (userId, orderId) => {
  try {
    const { rows: [completedOrder] } = await client.query(`
    UPDATE orders 
    SET is_complete = true
    WHERE id = $1
    RETURNING *
    `, [orderId])
    console.log('completedorder', completedOrder)

    const { rows: products } = await client.query(`
    SELECT 
      products.id,
      products.title,
      products.description,
      products.price,
      products.img
    FROM products
    RIGHT JOIN order_products
      ON products.id = order_products."productId"
    WHERE order_products."orderId" = $1
    `, [orderId])

    console.log('products', products)

    const productsPromise = await Promise.all(products.map(async (product) => {
      const { rows: [orderProduct] } = await client.query(`
      UPDATE order_products
      SET img = $1,
        title = $2,
        description = $3,
        paid_price = $4
      WHERE "productId" = ${product.id}
      RETURNING *
      `, [product.img, product.title, product.description, product.price])
      console.log(orderProduct)
    }))

    await createCart(userId)

    return completedOrder

  } catch (error) {
    console.error(error)
    throw error
  }
}

const getOrderProducts = async (orderId) => {
  try {
    const { rows: orderProducts } = await client.query(`
  SELECT * FROM order_products
  WHERE "orderId" = $1
  `, [orderId])

  } catch (error) {
    console.error(error)
    throw error
  }
}



module.exports = {
  getOrdersByUserId,
  completeOrder,
  getOrderProducts
}