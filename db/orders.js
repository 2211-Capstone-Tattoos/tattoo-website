const { client } = require('./client')

const getOrdersByUserId = async (userId) => {
  try {
    const { rows: orders } = await client.query(`
    SELECT * FROM orders
    WHERE "userId" = $1 AND is_complete = true
    `, [userId])
    return orders
  } catch (error) {
    console.error(error)
    throw error
  }
}

module.exports = {
  getOrdersByUserId
}