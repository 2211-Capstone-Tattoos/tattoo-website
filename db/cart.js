const { client } = require('./client')

const createCart = async (userId) => {
  try {
    const { rows: [cart] } = await client.query(`
    INSERT INTO orders("userId")
    VALUES ($1)
    RETURNING *
    `, [userId])
    return cart
  } catch (error) {
    console.log(error)
    throw error
  }
}

const getCartByUserId = async (userId) => {
  try {
    const { rows: [cart] } = await client.query(`
    SELECT * FROM orders
    WHERE "userId" = $1 AND is_complete = false
    `, [userId])
    const { rows: products } = await client.query(`
    SELECT * FROM products
    JOIN order_products 
      ON order_products."productId" = products.id
    WHERE "orderId" = $1
    `, [cart.id])
    cart.products = products
    return cart
  } catch (error) {
    console.error(error)
    throw error
  }
}

const addProductToCart = async ({ orderId, productId, quantity }) => {
  try {
    const { rows: [orderProduct] } = await client.query(`
    INSERT INTO order_products ("orderId", "productId", quantity)
    VALUES ($1, $2, $3)
    ON CONFLICT ("orderId", "productId") DO NOTHING
    RETURNING *
    `, [orderId, productId, quantity])
    return orderProduct
  } catch (error) {
    console.error(error)
    throw error
  }
}

module.exports = {
  createCart,
  getCartByUserId,
  addProductToCart
}