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
    console.error(error)
    throw error
  }
}

const getCartByUserId = async (userId) => {
  try {
    const { rows: [cart] } = await client.query(`
    SELECT * FROM orders
    WHERE "userId" = $1 AND is_complete = false
    `, [userId])
    if (cart) {
      const { rows: products } = await client.query(`
      SELECT * FROM order_products
      JOIN products 
      ON order_products."productId" = products.id
      WHERE "orderId" = $1
      `, [cart.id])
      cart.products = products
    }
    return cart
  } catch (error) {
    console.error(error)
    throw error
  }
}

const addProductToCart = async ({ orderId, productId, quantity }) => {

  try {
    const { rows: [productQuantity] } = await client.query(`
    SELECT quantity
    FROM order_products
    WHERE "orderId" = $1 AND "productId" = $2
    `, [orderId, productId])
    if (productQuantity) {
      quantity += productQuantity.quantity
    }
    const { rows: [orderProduct] } = await client.query(`
    INSERT INTO order_products ("orderId", "productId", quantity)
    VALUES ($1, $2, $3)
    ON CONFLICT ("orderId", "productId") 
    DO UPDATE SET quantity = $3 
    RETURNING *
    `, [orderId, productId, quantity])
    return orderProduct
  } catch (error) {
    console.error(error)
    throw error
  }
}

const removeProductFromCart = async (orderId, productId) => {
  try {
    const { rows: [removedProduct] } = await client.query(`
    DELETE FROM order_products
    WHERE "orderId" = $1 AND "productId" = $2
    RETURNING *
    `, [orderId, productId])
    return removedProduct
  } catch (error) {
    console.error(error)
    throw error
  }
}

const editProductQuantity = async ({ cartId, productId, quantity }) => {
  try {
    const { rows: [product] } = await client.query(`
    UPDATE order_products
    SET quantity = $1
    WHERE "orderId" = $2 AND "productId" = $3
    RETURNING *
    `, [quantity, cartId, productId])
    return product
  } catch (error) {
    console.error(error)
    throw error
  }
}

//think this needs to pass the values in separately. Also need the order product ids.
const editProductQuantities = async ({ ...fields }) => {
  try {
    const keys = Object.values(fields)

    const promisedProducts = await Promise.all(keys.map(async (key) => {
      const product = await editProductQuantity(key)
      return product

    }))
    return promisedProducts
  } catch (error) {
    console.error(error)
    throw error
  }
}

const clearCart = async (cartId) => {
  try {
    const { rows: deletedOrderProducts } = await client.query(`
    DELETE FROM order_products
    WHERE "orderId" = $1
    RETURNING *
    `, [cartId])
    return deletedOrderProducts
  } catch (error) {
    console.error(error)
    throw error
  }
}

module.exports = {
  createCart,
  getCartByUserId,
  addProductToCart,
  removeProductFromCart,
  editProductQuantity,
  editProductQuantities,
  clearCart
}