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
    return [cart]
  } catch (error) {
    console.error(error)
    throw error
  }
}

module.exports = {
  createCart,
  getCartByUserId
}