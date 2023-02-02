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
    WHERE id = $1
    `, [orderId])

    if (order) {
      const { rows: products } = await client.query(`
      SELECT * FROM order_products 
      WHERE "orderId" = $1
      `, [orderId])

      order.products = products
      return order
    }

  } catch (error) {
    console.error(error)
    throw error
  }
}

const completeOrder = async (orderId, userId) => {
  try {
    debugger
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

    const purchasedProducts = await Promise.all(products.map(async (product) => {
      const { rows: [orderProduct] } = await client.query(`
      UPDATE order_products
      SET img = $1,
      title = $2,
      description = $3,
      paid_price = $4
      WHERE "productId" = ${product.id}
      RETURNING *
      `, [product.img, product.title, product.description, product.price])
      return orderProduct
    }))

    const total = purchasedProducts.reduce((acc, product) => {
      sum = acc + (+product.paid_price.slice(1) * product.quantity)
      return sum
    }, 0)

    const { rows: [completedOrder] } = await client.query(`
    UPDATE orders 
    SET is_complete = true,
        ordered_at = CURRENT_TIMESTAMP,
        total = ${total}
    WHERE id = $1
    RETURNING *
    `, [orderId])
    if (userId) {
      const newCart = await createCart(userId)
      return newCart
    }
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
  getOrderProducts,
  getOrderById
}