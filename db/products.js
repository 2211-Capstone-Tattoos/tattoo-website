const { client } = require('./client')

const createProduct = async ({
  title,
  description,
  price,
  img,
  artistId
}) => {
  try {
    const { rows: [product] } = await client.query(`
    INSERT INTO products(title, description, price, img, "artistId")
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `, [title, description, price, img, artistId])
    return product
  } catch (error) {
    console.error(error)
    throw error
  }
}

const getProducts = async () => {
  try {
    const { rows: products } = await client.query(`
    SELECT * FROM products
    `)
    return products
  } catch (error) {
    console.error(error)
    throw error
  }
}

const getProductById = async (productId) => {
  try {
    const { rows: [product] } = await client.query(`
      SELECT * FROM products
      WHERE products.id = $1;
    `, [productId])
    return product
  } catch (error) {
    throw error
  }
}

const getProductsByUser = async (userId) => {
  try {
    const { rows: products } = await client.query(`
      SELECT * FROM products
      WHERE "artistId"=${userId};
    `)

    return products
  } catch (error) {
    throw error
  }
}

const updateProduct = async ({ id, ...fields }) => {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ")

  try {
    if (setString.length > 0) {
      const { rows: [product] } = await client.query(`
        UPDATE products
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
      `, Object.values(fields))

      return product
    } else {
      return
    }

  } catch (error) {
    console.error('Could not update that product ', error)
    throw error
  }
}

const removeProduct = async (productId) => {
  try {
    const { rows: [product] } = await client.query(`
      UPDATE products
      SET active=false
      WHERE id=${productId}
      RETURNING *;
    `)

    return product
  } catch (error) {
    throw error
  }
}

const getProductsByOrderId = async (orderId) => {
  try {
    const { rows: products } = await client.query(`
    SELECT 
      order_products.quantity, 
      products.price
    FROM products
    JOIN order_products
    ON products.id = order_products."productId"
    WHERE order_products."orderId" = ${orderId}
    `)
    return products
  } catch (error) {
    throw error
  }
}

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  getProductsByUser,
  updateProduct,
  removeProduct,
  getProductsByOrderId
}