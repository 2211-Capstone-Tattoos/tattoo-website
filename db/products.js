const { client } = require('./client')

const createProduct = async ({
  title,
  description,
  price,
  img,
  artistId }) => {
  try {
    const { rows: [product] } = await client.query(`
    INSERT INTO products(title, description, price, img, "artistId")
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `, [title, description, price, img, artistId])
    console.log(product)
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
    console.log(products)
    return products
  } catch (error) {
    console.error(error)
    throw error
  }
}

module.exports = {
  createProduct,
  getProducts
}